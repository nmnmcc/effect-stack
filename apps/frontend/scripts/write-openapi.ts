import { mkdir, writeFile } from "node:fs/promises";

import { openApiDocument } from "@effect-stack/api/openapi";

const outputDirectory = new URL("../.openapi/", import.meta.url);
const outputFile = new URL("effect-stack.json", outputDirectory);

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputFile, `${JSON.stringify(openApiDocument, null, 2)}\n`);
