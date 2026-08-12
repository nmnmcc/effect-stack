import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { AppHeader } from "./components/AppHeader";
import { Button } from "./components/ui/button";
import { localeFromRequest, LocalizationProvider, translate } from "./lib/localization";
import { createQueryClient } from "./lib/query-client";

export const links: Route.LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];

export const loader = ({ request }: Route.LoaderArgs) => ({ locale: localeFromRequest(request) });

export const meta: Route.MetaFunction = () => [
  { title: translate("en", "app.title") },
  { name: "description", content: translate("en", "app.description") },
];

export function Layout({ children }: { readonly children: ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");

  return (
    <html lang={data?.locale ?? "en"}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body className="bg-muted/40 text-foreground min-h-screen antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <LocalizationProvider locale={loaderData.locale}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen">
          <AppHeader />
          <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-16">
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </LocalizationProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isRouteError = isRouteErrorResponse(error);
  const status = isRouteError ? error.status : 500;
  const locale = useRouteLoaderData<typeof loader>("root")?.locale ?? "en";
  const titleKey = status === 404 ? "app.notFoundTitle" : "app.errorTitle";
  const detailsKey = status === 404 ? "app.notFound" : "app.errorDetails";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-start justify-center gap-4 px-4">
      <p className="text-muted-foreground text-sm font-medium">{status}</p>
      <h1 className="text-3xl font-semibold tracking-tight">{translate(locale, titleKey)}</h1>
      <p className="text-muted-foreground">{translate(locale, detailsKey)}</p>
      <Button asChild>
        <a href="/">{translate(locale, "app.goHome")}</a>
      </Button>
    </main>
  );
}
