import type { StorybookConfig } from '@storybook/react-webpack5';
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
    name: '@storybook/react-webpack5',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen',
    check: false,
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config) => {
    // Storybook에서 Node.js 모듈 처리
    if (config.resolve) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
      // Next.js 모듈을 Mock으로 대체
      config.resolve.alias = {
        ...config.resolve.alias,
        'next/link': path.resolve(__dirname, './mocks/next.js'),
        'next/navigation': path.resolve(__dirname, './mocks/next.js'),
      };
    }
    return config;
  },
};

export default config;

