import { Result } from "effect";

import { resolveApiOrigin } from "./runtime-config";

describe("resolveApiOrigin", () => {
  it("uses the current origin for web when no public API origin is configured", () => {
    const result = resolveApiOrigin({
      configuredApiUrl: undefined,
      isWeb: true,
      webOrigin: "https://todos.example.com",
    });

    expect(Result.getOrThrow(result)).toBe("https://todos.example.com");
  });

  it("requires an explicit origin for native", () => {
    const result = resolveApiOrigin({ configuredApiUrl: undefined, isWeb: false, webOrigin: undefined });

    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result)) expect(result.failure.reason).toBe("missing");
  });

  it.each(["ftp://example.com", "https://example.com/api", "https://example.com?mode=test", "not a url"])(
    "rejects a non-origin value: %s",
    (configuredApiUrl) => {
      const result = resolveApiOrigin({ configuredApiUrl, isWeb: false, webOrigin: undefined });

      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) expect(result.failure.reason).toBe("invalid");
    },
  );
});
