import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { TodoEncoded } from "@/generated/models";
import { useTranslation } from "@/lib/localization";

export interface TodoItemsProps {
  readonly isTodoPending: (id: string) => boolean;
  readonly onDelete: (id: string) => void;
  readonly onToggle: (todo: TodoEncoded) => void;
  readonly sessionUserId: string | undefined;
  readonly todos: readonly TodoEncoded[];
}

export function TodoItems({ isTodoPending, onDelete, onToggle, sessionUserId, todos }: TodoItemsProps) {
  const { t } = useTranslation();

  if (todos.length === 0) return <p className="text-muted-foreground border-t pt-5 text-sm">{t("todo.empty")}</p>;

  return (
    <ul className="divide-y">
      {todos.map((todo) => {
        const isOwner = sessionUserId === todo.userId;
        const isPending = isTodoPending(todo.id);

        return (
          <li className="grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3" key={todo.id}>
            {isOwner ? (
              <Checkbox
                aria-label={`${t("todo.toggle")} ${todo.title}`}
                checked={todo.isCompleted}
                disabled={isPending}
                onCheckedChange={() => onToggle(todo)}
              />
            ) : (
              <span aria-hidden="true" className="bg-border m-1 size-2 rounded-full" />
            )}
            <div className="grid min-w-0 gap-1">
              <span
                className={
                  todo.isCompleted
                    ? "text-muted-foreground font-medium break-words line-through"
                    : "font-medium break-words"
                }
              >
                {todo.title}
              </span>
              {isOwner ? (
                todo.isCompleted ? (
                  <Badge className="w-fit" variant="secondary">
                    {t("todo.completed")}
                  </Badge>
                ) : null
              ) : (
                <span className="text-muted-foreground text-xs">{t("todo.readOnly")}</span>
              )}
            </div>
            {isOwner ? (
              <Button
                disabled={isPending}
                onClick={() => onDelete(todo.id)}
                size="sm"
                type="button"
                variant="destructive"
              >
                {t("todo.delete")}
              </Button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
