import { HttpClientRequest } from "effect/unstable/http";

export const addNativeAuthCookie = (request: HttpClientRequest.HttpClientRequest, cookie: string) =>
  cookie.length === 0 ? request : HttpClientRequest.setHeader(request, "Cookie", cookie);
