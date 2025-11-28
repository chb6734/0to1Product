import type { Preview } from "@storybook/react";
import React from "react";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#0A0A0A",
        },
        {
          name: "light",
          value: "#FFFFFF",
        },
      ],
    },
    docs: {
      source: {
        type: "code",
        excludeDecorators: true,
        // Vite 의존성 청크 파일 제외
        filter: (source: string, storyContext: any) => {
          // node_modules나 .cache, sb-vite 등의 경로는 제외
          if (
            source.includes("node_modules") ||
            source.includes(".cache") ||
            source.includes("sb-vite") ||
            source.includes("chunk-")
          ) {
            return "";
          }
          return source;
        },
      },
    },
  },
};

export default preview;
