import { useTranslation } from "@/lib/localization";
import { useAppColors } from "@/lib/theme";
import { Button, Checkbox, List, ListItem, Text } from "@expo/ui";

export interface TodoItem {
  readonly id: string;
  readonly isCompleted: boolean;
  readonly title: string;
  readonly userId: string;
}

export interface TodoItemsProps {
  readonly onDelete: (id: string) => void;
  readonly onToggle: (todo: TodoItem) => void;
  readonly pendingTodoIds: ReadonlySet<string>;
  readonly sessionUserId: string | undefined;
  readonly todos: readonly TodoItem[];
}

export function TodoItems({ onDelete, onToggle, pendingTodoIds, sessionUserId, todos }: TodoItemsProps) {
  const { t } = useTranslation();
  const colors = useAppColors();

  return (
    <List>
      {todos.length === 0 ? <ListItem>{t("todo.empty")}</ListItem> : null}
      {todos.map((todo) => {
        const isOwner = sessionUserId === todo.userId;
        const isPending = pendingTodoIds.has(todo.id);
        const supportingText = isOwner ? (todo.isCompleted ? t("todo.completed") : undefined) : t("todo.readOnly");

        return (
          <ListItem
            key={todo.id}
            leading={
              isOwner ? (
                <Checkbox
                  disabled={isPending}
                  label={`${t("todo.toggle")} ${todo.title}`}
                  onValueChange={() => onToggle(todo)}
                  value={todo.isCompleted}
                />
              ) : undefined
            }
            supportingText={supportingText}
            trailing={
              isOwner ? (
                <Button
                  disabled={isPending}
                  label={t("todo.delete")}
                  onPress={() => onDelete(todo.id)}
                  variant="text"
                />
              ) : undefined
            }
          >
            <Text numberOfLines={2} textStyle={{ color: colors.text, fontSize: 16 }}>
              {todo.title}
            </Text>
          </ListItem>
        );
      })}
    </List>
  );
}
