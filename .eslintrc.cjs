/* eslint-disable */
module.exports = {
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    plugins: ["react-refresh"],
    rules: {
        "react/jsx-boolean-value": "error",
        "react-refresh/only-export-components": "warn",
        "no-magic-numbers": ["error", { "ignore": [0, 1] }],
        "@typescript-eslint/no-explicit-any": "error",
        indent: ["error", 4, { SwitchCase: 1 }],
    },
};
