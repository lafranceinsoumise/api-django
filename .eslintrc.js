const path = require('path');

module.exports = {
  "plugins": [
    "import",
    "react"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:react/recommended"
  ],
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": path.resolve(__dirname, "webpack.common.js")
      }
    }
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "ecmaFeatures": {
      "jsx": true
    },
    "sourceType": "module"
  },
  "env": {
    "es6": true,
    "browser": true,
    "node": true
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "react/jsx-closing-bracket-location": [
      1,
      "line-aligned"
    ],
    "react/no-unescaped-entities": [
      "error",
      {
        "forbid": [
          ">",
          "}",
          "\""
        ]
      }
    ]
  }
};