import { todoListParams, TodoScreen } from "@/components/TodoScreen";
import { getTodosListQueryOptions } from "@/generated/todos/todos";
import { createQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import type { Route } from "./+types/home";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const queryClient = createQueryClient();
  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  if (cookie !== null) headers.set("cookie", cookie);

  await queryClient.prefetchQuery(
    getTodosListQueryOptions(todoListParams, {
      request: { headers, signal: request.signal },
    }),
  );

  return { dehydratedState: dehydrate(queryClient) };
};

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <TodoScreen />
    </HydrationBoundary>
  );
}
