module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      globalReturn: true,
      generators: false,
      objectLiteralDuplicateProperties: false,
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["import", "arca"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/typescript",
    "plugin:@next/next/recommended"
  ],
  rules: {
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        multiline: {
          delimiter: "semi",
          requireLast: true,
        },
        singleline: {
          delimiter: "semi",
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
          prefer: 'type-imports',
          disallowTypeAnnotations: false
      }
    ],
    "quotes": ["error", "single", { "avoidEscape": true, "allowTemplateLiterals": true }],
    "no-console": ["error", { allow: ["warn", "error"] }],
    "arca/import-ordering": ["error", { sections: ["@material-ui", "^(src|types|server)/", "^\\.\\./", "^\\./"] }],
    "arca/newline-after-import-section": ["error", { sections: ["@material-ui", "^(src|types|server)/", "^\\.\\./", "^\\./"] }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  settings: {
    "react": {
      "version": "detect",
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".svg"],
      },
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
};
