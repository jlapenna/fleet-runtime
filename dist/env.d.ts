export type Environment = Record<string, string | undefined>;
export declare function sanitizeEnvValue(value: string | undefined): string | undefined;
export declare function optionalEnv(key: string, environment?: Environment): string | undefined;
export declare function requiredEnv(key: string, environment?: Environment): string;
export declare function isTrueEnv(key: string, environment?: Environment): boolean;
export declare function splitEnvList(key: string, environment?: Environment): string[];
