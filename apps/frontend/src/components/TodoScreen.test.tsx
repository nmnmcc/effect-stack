import { LocalizationProvider } from "@/lib/localization";
import { fireEvent, render, screen } from "@testing-library/react";

import { TodoItems } from "./TodoItems";

const ownTodo = {
  id: "own",
  isCompleted: false,
  title: "Owned todo",
  userId: "current-user",
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
};

const otherTodo = {
  ...ownTodo,
  id: "other",
  title: "Read-only todo",
  userId: "other-user",
};

describe("TodoItems", () => {
  it("only exposes mutation controls for the signed-in user's todos", () => {
    const onDelete = vi.fn();
    const onToggle = vi.fn();
    render(
      <LocalizationProvider locale="en">
        <TodoItems
          isTodoPending={() => false}
          onDelete={onDelete}
          onToggle={onToggle}
          sessionUserId="current-user"
          todos={[ownTodo, otherTodo]}
        />
      </LocalizationProvider>,
    );

    expect(screen.getAllByRole("checkbox")).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Delete" })).toHaveLength(1);
    expect(screen.getByText("Created by another user")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(onToggle).toHaveBeenCalledWith(ownTodo);
    expect(onDelete).toHaveBeenCalledWith("own");
  });
});
