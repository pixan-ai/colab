// Corre features/*.feature contra el build real (`next start`).
// Cada escenario y cada fila de ejemplos es una prueba con su propia IP, así
// que ninguna hereda los fallos de contraseña de otra.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync, readdirSync, mkdtempSync, existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PASSWORD = 'solo-para-pruebas-locales';
const gatewayLog = path.join(mkdtempSync(path.join(tmpdir(), 'pixan-')), 'gateway.jsonl');

// --- Servidores bajo prueba -------------------------------------------------

const children = [];
after(() => children.forEach((c) => c.kill()));

const freePort = () =>
  new Promise((resolve) => {
    const s = createServer().listen(0, () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });

async function boot(extraEnv) {
  const port = await freePort();
  const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(port)], {
    cwd: root,
    stdio: 'ignore',
    env: {
      PATH: process.env.PATH,
      NODE_ENV: 'production',
      NODE_OPTIONS: `--require ${path.join(root, 'tests/stub-gateway.cjs')}`,
      GATEWAY_LOG: gatewayLog,
      AI_GATEWAY_API_KEY: 'clave-de-prueba',
      ...extraEnv,
    },
  });
  children.push(child);
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 150; i++) {
    try {
      await fetch(`${base}/`);
      return base;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  throw new Error('El servidor de pruebas no arrancó. ¿Falta `next build`?');
}

const servers = {};
const server = (name) => (servers[name] ??= boot(name === 'conClave' ? { AUTH_PASSWORD: PASSWORD } : {}));

// --- Pasos ------------------------------------------------------------------

let ipCount = 0;
const newIp = () => `10.${(++ipCount >> 16) & 255}.${(ipCount >> 8) & 255}.${ipCount & 255}`;

const defaultBody = (route, ctx) => {
  if (route === '/api/chat') return { model: ctx.model, messages: [{ role: 'user', content: ctx.id }] };
  if (route === '/api/generate-infographic') return { prompt: ctx.id };
  return {};
};

async function request(ctx, { ip = ctx.ip, method, route, password, body }) {
  const headers = { 'x-forwarded-for': ip };
  if (password !== undefined) headers['x-auth-password'] = password;
  const init = { method, headers, signal: AbortSignal.timeout(10_000) };
  if (method === 'POST') {
    headers['content-type'] = 'application/json';
    init.body = JSON.stringify({ ...defaultBody(route, ctx), ...body });
  }
  ctx.res = await fetch((await server(ctx.server)) + route, init);
  ctx.text = await ctx.res.text();
}

const credentials = (text, quoted) => {
  if (text === 'sin contraseña') return {};
  if (text === 'con la contraseña correcta') return { password: PASSWORD };
  if (text === 'con la contraseña correcta en el cuerpo') return { body: { password: PASSWORD } };
  return { password: quoted };
};

const gatewayCalls = (ctx) =>
  (existsSync(gatewayLog) ? readFileSync(gatewayLog, 'utf8').trim().split('\n') : [])
    .map((line) => JSON.parse(line))
    .filter((call) => call.body?.messages?.[0]?.content === ctx.id && call.body.model === ctx.model);

const sourceFiles = (dir) =>
  readdirSync(path.join(root, dir), { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile())
    .map((e) => path.join(e.parentPath ?? e.path, e.name));

const steps = [
  [/^(?:que )?un servidor sin AUTH_PASSWORD$/, (ctx) => { ctx.server = 'sinClave'; }],

  [/^pido (GET|POST) (\S+) (sin contraseña|con la contraseña correcta en el cuerpo|con la contraseña correcta|con la contraseña "(.*)")$/,
    (ctx, method, route, text, quoted) => request(ctx, { method, route, ...credentials(text, quoted) })],

  [/^(?:que )?(?:una|esa) IP ha fallado la contraseña (\d+) veces$/, async (ctx, times) => {
    for (let i = 0; i < Number(times); i++) await request(ctx, { method: 'POST', route: '/api/chat', password: 'incorrecta' });
  }],

  [/^esa IP pide (GET|POST) (\S+) con la contraseña correcta$/,
    (ctx, method, route) => request(ctx, { method, route, password: PASSWORD })],

  [/^otra IP pide (GET|POST) (\S+) con la contraseña correcta$/,
    (ctx, method, route) => request(ctx, { ip: newIp(), method, route, password: PASSWORD })],

  [/^pido a \/api\/chat el modelo "(.+)" con la contraseña correcta$/, (ctx, model) => {
    ctx.model = model;
    return request(ctx, { method: 'POST', route: '/api/chat', password: PASSWORD });
  }],

  [/^la respuesta es (\d+)$/, (ctx, status) => assert.equal(ctx.res.status, Number(status), ctx.text.slice(0, 200))],

  [/^el cuerpo contiene "(.+)"$/, (ctx, text) => assert.ok(ctx.text.includes(text), `falta "${text}" en el cuerpo`)],

  [/^la respuesta trae la cabecera (\S+)$/, (ctx, name) => assert.ok(ctx.res.headers.get(name), `falta ${name}`)],

  [/^el gateway recibió (\d+) llamadas con ese modelo$/,
    (ctx, count) => assert.equal(gatewayCalls(ctx).length, Number(count))],

  [/^el gateway recibió esa llamada con max_tokens de (\d+) como máximo$/, (ctx, max) => {
    const [call] = gatewayCalls(ctx);
    assert.ok(call, 'el gateway no recibió la llamada');
    assert.ok(call.body.max_tokens > 0 && call.body.max_tokens <= Number(max), `max_tokens=${call.body.max_tokens}`);
  }],

  [/^el archivo (\S+) (contiene|no contiene) "(.+)"$/, (ctx, file, condition, text) => {
    const found = readFileSync(path.join(root, file), 'utf8').includes(text);
    assert.equal(found, condition === 'contiene', `${file} ${found ? 'contiene' : 'no contiene'} "${text}"`);
  }],

  [/^la versión instalada de next es (\d+)\.(\d+)\.(\d+) o posterior$/, (ctx, ...minimum) => {
    const { version } = JSON.parse(readFileSync(path.join(root, 'node_modules/next/package.json'), 'utf8'));
    const installed = version.split('.').map(Number);
    const order = minimum.map(Number).reduce((acc, min, i) => acc || installed[i] - min, 0);
    assert.ok(order >= 0, `next ${version} es anterior a ${minimum.join('.')}`);
  }],

  [/^ninguna variable de \.env\.example tiene valor$/, () => {
    const withValue = readFileSync(path.join(root, '.env.example'), 'utf8')
      .split('\n')
      .filter((line) => /^[A-Z_]+=.+/.test(line))
      .map((line) => line.split('=')[0]);
    assert.deepEqual(withValue, []);
  }],

  [/^ningún archivo de pages, components o lib contiene "(.+)"$/, (ctx, text) => {
    const hits = ['pages', 'components', 'lib']
      .flatMap(sourceFiles)
      .filter((file) => readFileSync(file, 'utf8').includes(text));
    assert.deepEqual(hits, []);
  }],
];

// --- Lector de Gherkin (el subconjunto que usamos) ---------------------------

function parseFeature(text) {
  const scenarios = [];
  let current = null;
  let header = null;
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    let m;
    if (!line || line.startsWith('#')) continue;
    if ((m = line.match(/^(?:Escenario|Esquema del escenario):\s*(.+)$/))) {
      current = { name: m[1], steps: [], rows: [] };
      header = null;
      scenarios.push(current);
    } else if (!current) {
      continue; // título y descripción de la característica
    } else if (line === 'Ejemplos:') {
      header = [];
    } else if (line.startsWith('|')) {
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      if (header.length === 0) header.push(...cells);
      else current.rows.push(Object.fromEntries(header.map((h, i) => [h, cells[i]])));
    } else if ((m = line.match(/^(?:Dado|Cuando|Entonces|Y)\s+(.+)$/))) {
      current.steps.push(m[1]);
    } else {
      throw new Error(`Línea no reconocida en el .feature: ${line}`);
    }
  }
  return scenarios;
}

let scenarioCount = 0;
for (const file of readdirSync(path.join(root, 'features')).filter((f) => f.endsWith('.feature'))) {
  for (const scenario of parseFeature(readFileSync(path.join(root, 'features', file), 'utf8'))) {
    for (const row of scenario.rows.length ? scenario.rows : [null]) {
      const fill = (s) => (row ? s.replace(/<([^>]+)>/g, (_, key) => row[key]) : s);
      const title = row ? `${scenario.name} [${Object.values(row).join(' | ')}]` : scenario.name;
      test(title, async () => {
        const ctx = {
          id: `escenario-${++scenarioCount}`,
          ip: newIp(),
          server: 'conClave',
          model: 'anthropic/claude-sonnet-4.5',
        };
        for (const step of scenario.steps.map(fill)) {
          const match = steps.map(([re, fn]) => [step.match(re), fn]).find(([m]) => m);
          assert.ok(match, `Paso sin definición: ${step}`);
          await match[1](ctx, ...match[0].slice(1));
        }
      });
    }
  }
}
