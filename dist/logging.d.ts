export declare const LOG_LEVELS: readonly ["error", "warn", "info", "debug"];
export type LogLevel = (typeof LOG_LEVELS)[number];
export interface LogEnrichment {
    traceId?: string;
    requestUrl?: string;
    userId?: string;
    action?: string;
}
export type LogEnricher = () => LogEnrichment;
export type LogFormatter = (args: unknown[]) => string;
export type StructuredLogFields = Readonly<Record<string, unknown>>;
export declare function shouldLog(currentLevel: string, messageLevel: string): boolean;
export declare function setLogEnricher(enricher: LogEnricher): void;
export declare function setLogFormatter(formatter: LogFormatter): void;
export declare function setLogDefaults(options: {
    getLogLevel?: () => string | undefined;
    formatter?: LogFormatter;
}): void;
export declare class Logger {
    private readonly level;
    private readonly options;
    constructor(level: LogLevel, options?: {
        isOnGoogleCloud?: () => boolean;
        forceStructuredLogging?: () => boolean;
    });
    static getLogLevel(): LogLevel;
    getLevel(): LogLevel;
    private log;
    /**
     * Emits machine-readable top-level fields in structured environments.
     * Reserved envelope/context keys cannot be supplied by callers.
     */
    structured(severity: LogLevel, message: string, fields: StructuredLogFields, options?: {
        enrich?: boolean;
    }): void;
    info(...args: unknown[]): void;
    debug(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
}
