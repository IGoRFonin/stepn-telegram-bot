module.exports = {
    "root": true,
    "extends": [
        "eslint:recommended"
    ],
    "parserOptions": {
        sourceType: "module",
        "ecmaVersion": 2017
    },
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js']
};
