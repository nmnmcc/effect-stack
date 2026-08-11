import { Api } from "@effect-stack/api";
import { Layer } from "effect";
import { FetchHttpClient, HttpClient } from "effect/unstable/http";
import { AtomHttpApi } from "effect/unstable/reactivity";

import { authClient } from "./auth-client.native";
import { addNativeAuthCookie } from "./native-auth-cookie";
import { apiOrigin } from "./runtime-config";

export class ApiClient extends AtomHttpApi.Service<ApiClient>()("ApiClient", {
  api: Api,
  baseUrl: apiOrigin,
  httpClient: FetchHttpClient.layer.pipe(
    Layer.provide(Layer.succeed(FetchHttpClient.RequestInit, { credentials: "omit" })),
  ),
  transformClient: HttpClient.mapRequest((request) => addNativeAuthCookie(request, authClient.getCookie())),
}) {}
