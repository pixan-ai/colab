import { createHash, timingSafeEqual } from 'crypto';

// Fallos de contraseña permitidos por IP antes de bloquearla, y por cuánto.
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

// ip -> { count, resetAt }. Vive en la memoria de esta instancia: frena la
// fuerza bruta, pero no es un contador global (ver SECURITY.md).
const failures = new Map();

const digest = (value) => createHash('sha256').update(value).digest();

// Envuelve un handler de API: sin la contraseña correcta en la cabecera
// x-auth-password no se ejecuta. Sin AUTH_PASSWORD configurada, nadie entra.
export default function withAuth(handler) {
  return async (req, res) => {
    // En Vercel la plataforma escribe x-forwarded-for; el cliente no puede falsearla.
    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(',')[0].trim();
    const now = Date.now();

    let entry = failures.get(ip);
    if (entry && entry.resetAt <= now) {
      failures.delete(ip);
      entry = undefined;
    }

    if (entry && entry.count >= MAX_FAILURES) {
      res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
      return res.status(429).json({ error: 'Too many failed attempts. Try again later.', code: 'RATE_LIMITED' });
    }

    const expected = process.env.AUTH_PASSWORD;
    const given = req.headers['x-auth-password'];

    if (!expected || !given || !timingSafeEqual(digest(given), digest(expected))) {
      if (!entry && failures.size >= 10000) {
        for (const [key, value] of failures) if (value.resetAt <= now) failures.delete(key);
      }
      failures.set(ip, { count: (entry?.count || 0) + 1, resetAt: entry?.resetAt || now + WINDOW_MS });
      return res.status(401).json({ error: 'Acceso no autorizado. Password incorrecto.', code: 'AUTH_FAILED' });
    }

    failures.delete(ip);
    return handler(req, res);
  };
}
