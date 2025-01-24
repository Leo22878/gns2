import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { ignores: ['dist', 'out'] },
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                launcherAPI: 'readonly',
            },
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat['jsx-runtime'],
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
