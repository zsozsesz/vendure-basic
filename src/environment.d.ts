export {};

// Here we declare the members of the process.env object, so that we
// can use them in our application code in a type-safe manner.
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_ENV: string;
            PORT: string;
            COOKIE_SECRET: string;
            SUPERADMIN_USERNAME: string;
            SUPERADMIN_PASSWORD: string;
            APP_URL: string;
            POSTGRES_DB: string;
            POSTGRES_USER: string;
            POSTGRES_PASSWORD: string;
            POSTGRES_HOST: string;
            POSTGRES_PORT: string;
            POSTGRES_SCHEMA: string;
            PG_ENABLED: string;
        }
    }
}
