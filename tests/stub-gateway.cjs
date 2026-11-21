// Se carga dentro del servidor de pruebas (NODE_OPTIONS=--require). Sustituye
// solo las llamadas a Vercel AI Gateway: anota lo que recibió y contesta algo
// fijo, para que las pruebas no gasten créditos ni dependan de la red.
const fs = require('fs');

const realFetch = globalThis.fetch;

globalThis.fetch = async (url, init = {}) => {
  if (!String(url).startsWith('https://ai-gateway.vercel.sh/')) return realFetch(url, init);

  const body = init.body ? JSON.parse(init.body) : null;
  fs.appendFileSync(process.env.GATEWAY_LOG, JSON.stringify({ url: String(url), body }) + '\n');

  if (String(url).endsWith('/credits')) return Response.json({ balance: '1.00', total_used: '2.00' });
  if (body.stream) {
    return new Response('data: {"choices":[{"delta":{"content":"ok"}}]}\n\ndata: [DONE]\n\n', {
      headers: { 'content-type': 'text/event-stream' },
    });
  }
  return Response.json({ choices: [{ message: { content: 'ok', images: [] } }] });
};
