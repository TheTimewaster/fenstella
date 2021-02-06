module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "array-element-newline": ["error", "consistent"],
        "curly": 2,
        "vue/max-attributes-per-line": ["error", {
            singleline: 4,
            multiline: {
                max: 1,
                allowFirstLine: false
            }
        }],
        "semi": ["error", "always"],
        "quotes": ["warn", "double", { "avoidEscape": true }],
        "indent": ["warn", 4, { "VariableDeclarator": 1 }],
        "space-before-function-paren": ["warn", "never"],

        "vue/html-indent": ["error", 4, {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }]
    },
}
