import type { StorybookConfig } from '@storybook/react-vite';
import * as path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
    check: false,
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    // Next.js 모듈을 Mock으로 대체
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/link': path.resolve(__dirname, './mocks/next.js'),
      'next/navigation': path.resolve(__dirname, './mocks/next.js'),
      // tsconfig의 path alias 설정
      '@': path.resolve(__dirname, '../src'),
    };
    return config;
  },
};

export default config;

