import { defineRelations } from "drizzle-orm";

import * as schema from "./schema";
import { authRelations } from "./schema/auth";

const applicationRelations = defineRelations(schema, (r) => ({
  users: {
    todos: r.many.todos(),
  },
  todos: {
    user: r.one.users({
      from: r.todos.userId,
      to: r.users.id,
    }),
  },
}));

export const relations = {
  ...applicationRelations,
  ...authRelations,
  users: {
    ...applicationRelations.users,
    relations: {
      ...applicationRelations.users.relations,
      ...authRelations.users.relations,
    },
  },
};
