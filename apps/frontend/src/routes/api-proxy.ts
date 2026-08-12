import type { Route } from "./+types/api-proxy";

const proxyRequest = async (request: Request) => {
  const sourceUrl = new URL(request.url);
  const backendUrl = process.env["BACKEND_URL"] ?? "http://localhost:30000";
  const targetUrl = new URL(`${sourceUrl.pathname}${sourceUrl.search}`, backendUrl);

  try {
    return await fetch(new Request(targetUrl, request));
  } catch {
    return Response.json({ _tag: "BackendUnavailable" }, { status: 502 });
  }
};

export const loader = ({ request }: Route.LoaderArgs) => proxyRequest(request);
export const action = ({ request }: Route.ActionArgs) => proxyRequest(request);
