import { Api } from "@effect-stack/api";
import { openApiDocument } from "@effect-stack/api/openapi";
import { assert, it } from "@effect/vitest";
import { OpenApi } from "effect/unstable/httpapi";

it("exports the OpenAPI document generated from the shared HttpApi", () => {
  assert.deepEqual(openApiDocument, OpenApi.fromApi(Api));
  assert.equal(openApiDocument.openapi, "3.1.0");
  assert.deepEqual(openApiDocument.info, {
    title: "effect-stack API",
    version: "0.1.0",
  });
  assert.deepEqual(Object.keys(openApiDocument.paths), ["/api/health", "/api/todos", "/api/todos/{id}"]);
});
