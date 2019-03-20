module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "indent":"off",
        "linebreak-style": [
            "error",
            "unix"
        ],
        "no-console":"off",
        "no-undef":"off",
        "no-unused-vars":"off",
        "quotes": "off",
        "semi": [
            "error",
            "always"
        ]
    }
};