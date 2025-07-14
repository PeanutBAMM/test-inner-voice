module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'react-native',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  env: {
    'react-native/react-native': true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    '.eslintrc.js', 
    'babel.config.js', 
    'metro.config.js', 
    'jest.config.js',
    'android/**/*',
    'ios/**/*',
    'node_modules/**/*'
  ],
  rules: {
    // React rules
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    
    // React Native specific rules - relaxed for InnerVoice
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'off', // Allow for MoodSphere styling
    'react-native/no-raw-text': 'off',
    'react-native/no-color-literals': 'off',
    'react-native/sort-styles': 'off',
    
    // TypeScript rules - relaxed for development
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    
    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'warn',
    'no-unused-vars': 'off', // Use @typescript-eslint version instead
  },
};