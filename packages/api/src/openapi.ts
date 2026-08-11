import { OpenApi } from "effect/unstable/httpapi";

import { Api } from "./api";

export const openApiDocument = OpenApi.fromApi(Api);
