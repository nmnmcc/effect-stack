import { Data, Result } from "effect";
import { Platform } from "react-native";

export class RuntimeConfigError extends Data.TaggedError("RuntimeConfigError")<{
  readonly reason: "invalid" | "missing";
}> {}

export interface RuntimeConfigInput {
  readonly configuredApiUrl: string | undefined;
  readonly isWeb: boolean;
  readonly webOrigin: string | undefined;
}

export const resolveApiOrigin = ({ configuredApiUrl, isWeb, webOrigin }: RuntimeConfigInput) => {
  const configured = configuredApiUrl?.trim();
  const candidate = configured && configured.length > 0 ? configured : isWeb ? webOrigin : undefined;

  if (candidate === undefined) {
    return Result.fail(new RuntimeConfigError({ reason: "missing" }));
  }

  return Result.try({
    try: () => new URL(candidate),
    catch: () => new RuntimeConfigError({ reason: "invalid" }),
  }).pipe(
    Result.flatMap((url) => {
      const isHttp = url.protocol === "http:" || url.protocol === "https:";
      const isOriginOnly = url.pathname === "/" && url.search.length === 0 && url.hash.length === 0;

      return isHttp && isOriginOnly
        ? Result.succeed(url.origin)
        : Result.fail(new RuntimeConfigError({ reason: "invalid" }));
    }),
  );
};

const webOrigin = typeof globalThis.location === "undefined" ? undefined : globalThis.location.origin;

export const runtimeConfig = resolveApiOrigin({
  configuredApiUrl: process.env["EXPO_PUBLIC_API_URL"],
  isWeb: Platform.OS === "web",
  webOrigin,
});

export const apiOrigin = Result.getOrElse(runtimeConfig, () => "http://127.0.0.1:1");
