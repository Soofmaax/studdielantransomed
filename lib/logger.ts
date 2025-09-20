/**
 * Lightweight logger that works in both browser and Node without extra deps.
 * Avoids bundling server-only transports like pino-pretty into client builds.
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development';

function log(level: LogLevel, ...args: unknown[]) {
  // In browsers, map levels to console methods
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    (console as any)[level] ? (console as any)[level](...args) : console.log(...args);
    return;
  }
  // In Node, also use console to avoid extra dependencies
  // eslint-disable-next-line no-console
  (console as any)[level] ? (console as any)[level](...args) : console.log(...args);
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) log('debug', ...args);
  },
  info: (...args: unknown[]) => log('info', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  error: (...args: unknown[]) => log('error', ...args),
};