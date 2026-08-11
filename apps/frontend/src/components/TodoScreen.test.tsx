import { fireEvent, render } from "@testing-library/react-native";

import { TodoItems } from "./TodoItems";

jest.mock("expo-localization", () => ({
  useLocales: () => [{ languageCode: "en", languageTag: "en-US", regionCode: "US" }],
}));

const ownTodo = {
  id: "own",
  isCompleted: false,
  title: "Owned todo",
  userId: "current-user",
};

const otherTodo = {
  id: "other",
  isCompleted: false,
  title: "Read-only todo",
  userId: "other-user",
};

describe("TodoItems", () => {
  it("only exposes mutation controls for the signed-in user's todos", async () => {
    const onDelete = jest.fn();
    const onToggle = jest.fn();
    const screen = await render(
      <TodoItems
        onDelete={onDelete}
        onToggle={onToggle}
        pendingTodoIds={new Set()}
        sessionUserId="current-user"
        todos={[ownTodo, otherTodo]}
      />,
    );

    expect(screen.getAllByRole("checkbox")).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Delete" })).toHaveLength(1);
    expect(screen.getByText("Created by another user")).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("checkbox"));
    await fireEvent.press(screen.getByRole("button", { name: "Delete" }));

    expect(onToggle).toHaveBeenCalledWith(ownTodo);
    expect(onDelete).toHaveBeenCalledWith("own");
  });
});
