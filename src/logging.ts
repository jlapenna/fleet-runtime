export const LOG_LEVELS = ['error', 'warn', 'info', 'debug'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

export interface LogEnrichment {
  traceId?: string;
  requestUrl?: string;
  userId?: string;
  action?: string;
}

export type LogEnricher = () => LogEnrichment;
export type LogFormatter = (args: unknown[]) => string;

let logEnricher: LogEnricher = () => ({});
let logFormatter: LogFormatter = (args) =>
  args
    .map((arg) => {
      if (typeof arg === 'string') return arg;
      if (arg instanceof Error) return arg.stack || arg.message;
      return JSON.stringify(arg);
    })
    .join(' ');
let defaultLogLevelGetter: () => string | undefined = () =>
  typeof process !== 'undefined' ? process.env?.LOG_LEVEL : undefined;

export function shouldLog(currentLevel: string, messageLevel: string): boolean {
  return LOG_LEVELS.indexOf(messageLevel as LogLevel) <= LOG_LEVELS.indexOf(currentLevel as LogLevel);
}

export function setLogEnricher(enricher: LogEnricher): void {
  logEnricher = enricher;
}

export function setLogFormatter(formatter: LogFormatter): void {
  logFormatter = formatter;
}

export function setLogDefaults(options: {
  getLogLevel?: () => string | undefined;
  formatter?: LogFormatter;
}): void {
  if (options.getLogLevel) defaultLogLevelGetter = options.getLogLevel;
  if (options.formatter) logFormatter = options.formatter;
}

export class Logger {
  constructor(
    private readonly level: LogLevel,
    private readonly options: {
      isOnGoogleCloud?: () => boolean;
      forceStructuredLogging?: () => boolean;
    } = {},
  ) {}

  static getLogLevel(): LogLevel {
    try {
      const level = defaultLogLevelGetter()?.toLowerCase();
      if (level && LOG_LEVELS.includes(level as LogLevel)) return level as LogLevel;
    } catch {
      // An environment accessor must never prevent logging.
    }
    return 'debug';
  }

  getLevel(): LogLevel {
    return this.level;
  }

  private log(severity: LogLevel, ...args: unknown[]): void {
    if (this.options.isOnGoogleCloud?.() || this.options.forceStructuredLogging?.()) {
      const enrichment = logEnricher();
      console.log(
        JSON.stringify({
          severity: severity.toUpperCase(),
          message: logFormatter(args),
          ...(enrichment.traceId ? { 'logging.googleapis.com/trace': enrichment.traceId } : {}),
          ...(enrichment.requestUrl ? { httpRequest: { requestUrl: enrichment.requestUrl } } : {}),
          ...(enrichment.userId ? { userId: enrichment.userId } : {}),
          ...(enrichment.action ? { action: enrichment.action } : {}),
        }),
      );
      return;
    }
    console[severity === 'info' ? 'log' : severity](...args);
  }

  info(...args: unknown[]): void { if (shouldLog(this.level, 'info')) this.log('info', ...args); }
  debug(...args: unknown[]): void { if (shouldLog(this.level, 'debug')) this.log('debug', ...args); }
  warn(...args: unknown[]): void { if (shouldLog(this.level, 'warn')) this.log('warn', ...args); }
  error(...args: unknown[]): void { if (shouldLog(this.level, 'error')) this.log('error', ...args); }
}
