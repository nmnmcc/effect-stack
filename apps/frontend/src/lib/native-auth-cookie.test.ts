import { Option } from "effect";
import { Headers, HttpClientRequest } from "effect/unstable/http";

import { addNativeAuthCookie } from "./native-auth-cookie";

describe("addNativeAuthCookie", () => {
  it("adds the Better Auth cookie to native API requests", () => {
    const request = addNativeAuthCookie(HttpClientRequest.get("https://api.example.com/api/todos"), "session=abc");

    expect(Option.getOrUndefined(Headers.get(request.headers, "cookie"))).toBe("session=abc");
  });

  it("does not add an empty Cookie header", () => {
    const request = addNativeAuthCookie(HttpClientRequest.get("https://api.example.com/api/todos"), "");

    expect(Option.isNone(Headers.get(request.headers, "cookie"))).toBe(true);
  });
});
