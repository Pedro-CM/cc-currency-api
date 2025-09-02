// jest.config.mjs
export default {
    testEnvironment: 'node',
    // Transforma archivos .js con Babel para que Jest entienda ESM sin hacks raros
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    // Trata .js como ESM dentro de Jest (porque tienes "type":"module")
    extensionsToTreatAsEsm: ['.js'],
    moduleFileExtensions: ['js', 'json'],
    // Opcional: ubica tus tests
    testMatch: ['**/*.test.js', '**/__tests__/**/*.test.js'],
    // Silencia warnings de libs si molestan
    // verbose: true,
};
