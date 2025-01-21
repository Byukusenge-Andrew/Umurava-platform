import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json'
        }]
    },
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/src/$1'
    },
    verbose: true,
    testMatch: ['**/*.test.ts'],
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true
};

export default config; 