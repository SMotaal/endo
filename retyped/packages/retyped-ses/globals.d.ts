declare var assert: typeof globalThis extends { null: any, assert: infer T }
    ? T
    : typeof import('src/error/internal/assert').assert;