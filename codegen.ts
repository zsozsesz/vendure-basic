import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    // This assumes your server is running on the standard port
    // and with the default admin API path. Adjust accordingly.
    schema: 'http://localhost:3000/admin-api',
    config: {
        // This tells codegen that the `Money` scalar is a number
        scalars: { Money: 'number' },
        // This ensures generated enums do not conflict with the built-in types.
        namingConvention: { enumValues: 'keep' },
    },
    generates: {
        './src/plugins/table/gql/generated.ts': { plugins: ['typescript'] },
        './src/plugins/table/ui/gql/': {
            preset: 'client',
            documents: './src/plugins/table/ui/**/*.ts',
            presetConfig: {
                fragmentMasking: false,
            },
        },
    },
};

export default config;
