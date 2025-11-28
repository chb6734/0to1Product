import type { StorybookConfig } from "@storybook/react-vite";
import * as path from "path";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      strictMode: true,
    },
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
    check: false,
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    // Next.js 모듈을 Mock으로 대체
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "next/link": path.resolve(__dirname, "./mocks/next.jsx"),
      "next/navigation": path.resolve(__dirname, "./mocks/next.jsx"),
      // tsconfig의 path alias 설정
      "@": path.resolve(__dirname, "../src"),
    };

    // TypeScript와 ES 모듈 지원 강화
    return mergeConfig(config, {
      esbuild: {
        target: "es2020",
        jsx: "automatic", // React 17+ JSX Transform
      },
      optimizeDeps: {
        include: ["@storybook/react", "react", "react-dom"],
      },
      build: {
        commonjsOptions: {
          include: [/node_modules/],
        },
      },
    });
  },
};

export default config;
