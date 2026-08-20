export function sanitizeEnvValue(value) {
    if (typeof value !== 'string')
        return undefined;
    const lower = value.toLowerCase();
    return lower === 'undefined' || lower === 'null' ? undefined : value;
}
export function optionalEnv(key, environment = process.env) {
    return sanitizeEnvValue(environment[key]);
}
export function requiredEnv(key, environment = process.env) {
    const value = optionalEnv(key, environment);
    if (value === undefined) {
        throw new Error(`process.env.${key} not defined`);
    }
    return value;
}
export function isTrueEnv(key, environment = process.env) {
    return optionalEnv(key, environment)?.toLowerCase() === 'true';
}
export function splitEnvList(key, environment = process.env) {
    return (optionalEnv(key, environment) ?? '')
        .split(/[:,]/)
        .map((value) => value.trim())
        .filter((value) => value.length > 0);
}
