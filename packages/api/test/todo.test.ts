import { Todo } from "@effect-stack/api";
import { assert, it } from "@effect/vitest";
import { Schema } from "effect";

it("encodes todo response instances for the HTTP API", () => {
  const createdAt = new Date("2026-08-20T00:00:00.000Z");
  const updatedAt = new Date("2026-08-21T00:00:00.000Z");

  assert.deepEqual(
    Schema.encodeUnknownSync(Todo)(
      new Todo({
        id: "01991fc1-f8c6-7000-8000-000000000000",
        title: "Effect RC",
        isCompleted: true,
        userId: "01991fc1-f8c6-7000-8000-000000000001",
        createdAt,
        updatedAt,
      }),
    ),
    {
      id: "01991fc1-f8c6-7000-8000-000000000000",
      title: "Effect RC",
      isCompleted: true,
      userId: "01991fc1-f8c6-7000-8000-000000000001",
      createdAt: "2026-08-20T00:00:00.000Z",
      updatedAt: "2026-08-21T00:00:00.000Z",
    },
  );
});
