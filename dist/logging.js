export const LOG_LEVELS = ['error', 'warn', 'info', 'debug'];
const RESERVED_STRUCTURED_KEYS = new Set([
    'severity',
    'message',
    'logging.googleapis.com/trace',
    'httpRequest',
    'userId',
    'action',
]);
const MAX_CAUSE_CHAIN_DEPTH = 5;
/**
 * Formats an Error together with its `cause` chain so root causes are never
 * silently dropped from logs. Each cause is rendered on its own line,
 * prefixed `Caused by: ` (its stack when it is itself an Error, otherwise
 * `String(cause)`). Traversal stops after `MAX_CAUSE_CHAIN_DEPTH` causes and
 * is guarded against cycles.
 */
function formatErrorWithCauses(error) {
    const lines = [error.stack || error.message];
    const seen = new Set([error]);
    let cause = error.cause;
    let depth = 0;
    while (cause !== undefined && depth < MAX_CAUSE_CHAIN_DEPTH) {
        if (seen.has(cause))
            break;
        seen.add(cause);
        lines.push(`Caused by: ${cause instanceof Error ? cause.stack || cause.message : String(cause)}`);
        cause = cause instanceof Error ? cause.cause : undefined;
        depth += 1;
    }
    return lines.join('\n');
}
let logEnricher = () => ({});
let logFormatter = (args) => args
    .map((arg) => {
    if (typeof arg === 'string')
        return arg;
    if (arg instanceof Error)
        return formatErrorWithCauses(arg);
    return JSON.stringify(arg);
})
    .join(' ');
let defaultLogLevelGetter = () => typeof process !== 'undefined' ? process.env?.LOG_LEVEL : undefined;
export function shouldLog(currentLevel, messageLevel) {
    return LOG_LEVELS.indexOf(messageLevel) <= LOG_LEVELS.indexOf(currentLevel);
}
export function setLogEnricher(enricher) {
    logEnricher = enricher;
}
export function setLogFormatter(formatter) {
    logFormatter = formatter;
}
export function setLogDefaults(options) {
    if (options.getLogLevel)
        defaultLogLevelGetter = options.getLogLevel;
    if (options.formatter)
        logFormatter = options.formatter;
}
export class Logger {
    level;
    options;
    constructor(level, options = {}) {
        this.level = level;
        this.options = options;
    }
    static getLogLevel() {
        try {
            const level = defaultLogLevelGetter()?.toLowerCase();
            if (level && LOG_LEVELS.includes(level))
                return level;
        }
        catch {
            // An environment accessor must never prevent logging.
        }
        return 'debug';
    }
    getLevel() {
        return this.level;
    }
    log(severity, ...args) {
        if (this.options.isOnGoogleCloud?.() || this.options.forceStructuredLogging?.()) {
            const enrichment = logEnricher();
            console.log(JSON.stringify({
                severity: severity.toUpperCase(),
                message: logFormatter(args),
                ...(enrichment.traceId ? { 'logging.googleapis.com/trace': enrichment.traceId } : {}),
                ...(enrichment.requestUrl ? { httpRequest: { requestUrl: enrichment.requestUrl } } : {}),
                ...(enrichment.userId ? { userId: enrichment.userId } : {}),
                ...(enrichment.action ? { action: enrichment.action } : {}),
            }));
            return;
        }
        console[severity === 'info' ? 'log' : severity](...args);
    }
    /**
     * Emits machine-readable top-level fields in structured environments.
     * Reserved envelope/context keys cannot be supplied by callers.
     */
    structured(severity, message, fields, options = {}) {
        if (!shouldLog(this.level, severity))
            return;
        const safeFields = Object.fromEntries(Object.entries(fields).filter(([key]) => !RESERVED_STRUCTURED_KEYS.has(key)));
        if (this.options.isOnGoogleCloud?.() ||
            this.options.forceStructuredLogging?.()) {
            const enrichment = options.enrich === false ? {} : logEnricher();
            console.log(JSON.stringify({
                severity: severity.toUpperCase(),
                message,
                ...safeFields,
                ...(enrichment.traceId
                    ? { 'logging.googleapis.com/trace': enrichment.traceId }
                    : {}),
                ...(enrichment.requestUrl
                    ? { httpRequest: { requestUrl: enrichment.requestUrl } }
                    : {}),
                ...(enrichment.userId ? { userId: enrichment.userId } : {}),
                ...(enrichment.action ? { action: enrichment.action } : {}),
            }));
            return;
        }
        console[severity === 'info' ? 'log' : severity](message, safeFields);
    }
    info(...args) { if (shouldLog(this.level, 'info'))
        this.log('info', ...args); }
    debug(...args) { if (shouldLog(this.level, 'debug'))
        this.log('debug', ...args); }
    warn(...args) { if (shouldLog(this.level, 'warn'))
        this.log('warn', ...args); }
    error(...args) { if (shouldLog(this.level, 'error'))
        this.log('error', ...args); }
}
