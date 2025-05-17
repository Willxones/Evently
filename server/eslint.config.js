// eslint.config.js
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

import globals from 'globals';

export default [
    js.configs.recommended,

    {
        files: ['**/*.ts'],
        ignores: ['**/*.types.ts'],
        languageOptions: {
            parser,
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
            },
            globals: {
                ...globals.node
            }
        },
        plugins: {
            '@typescript-eslint': ts,
            import: importPlugin,
            'unused-imports': unusedImports,
        },
        rules: {
            // General JS/TS rules
            'no-debugger': 'warn',

            // TypeScript-specific rules
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'off',

            // Unused imports
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],

            // Import sorting and structure
            'import/order': [
                'warn',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        ['parent', 'sibling', 'index'],
                    ],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
        },
    },

    // Apply Prettier last to avoid conflicts
    {
        rules: {
            ...prettier.rules,
        },
    },
];