/**
 * Lightweight logger that works in both browser and Node without extra deps.
 * Avoids bundling server-only transports like pino-pretty into client builds.
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development';

function getConsoleMethod(level: LogLevel): (...args: unknown[]) => void {
  const method = (console as unknown as Record<string, (...args: unknown[]) => void>)[level];
  return typeof method === 'function' ? method : console.log;
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) getConsoleMethod('debug')(...args);
  },
  info: (...args: unknown[]) => getConsoleMethod('info')(...args),
  warn: (...args: unknown[]) => getConsoleMethod('warn')(...args),
  error: (...args: unknown[]) => getConsoleMethod('error')(...args),
};