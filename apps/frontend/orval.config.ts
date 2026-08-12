import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "./.openapi/effect-stack.json",
    },
    output: {
      clean: true,
      client: "react-query",
      formatter: "prettier",
      httpClient: "fetch",
      mode: "tags-split",
      schemas: "./src/generated/models",
      target: "./src/generated/api.ts",
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
        mutator: {
          name: "apiFetch",
          path: "./src/lib/api-fetch.ts",
        },
      },
    },
  },
});
