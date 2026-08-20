export type Environment = Record<string, string | undefined>;

export function sanitizeEnvValue(value: string | undefined): string | undefined {
  if (typeof value !== 'string') return undefined;
  const lower = value.toLowerCase();
  return lower === 'undefined' || lower === 'null' ? undefined : value;
}

export function optionalEnv(key: string, environment: Environment = process.env): string | undefined {
  return sanitizeEnvValue(environment[key]);
}

export function requiredEnv(key: string, environment: Environment = process.env): string {
  const value = optionalEnv(key, environment);
  if (value === undefined) {
    throw new Error(`process.env.${key} not defined`);
  }
  return value;
}

export function isTrueEnv(key: string, environment: Environment = process.env): boolean {
  return optionalEnv(key, environment)?.toLowerCase() === 'true';
}

export function splitEnvList(key: string, environment: Environment = process.env): string[] {
  return (optionalEnv(key, environment) ?? '')
    .split(/[:,]/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}
