import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { AuthForm } from "./AuthForm";

const mockRouter = { replace: jest.fn() };
const mockLocaleState = {
  current: [{ languageCode: "en", languageTag: "en-US", regionCode: "US" }],
};

jest.mock("expo-router", () => ({ useRouter: () => mockRouter }));
jest.mock("expo-localization", () => ({ useLocales: () => mockLocaleState.current }));

describe("AuthForm", () => {
  beforeEach(() => {
    mockRouter.replace.mockClear();
    mockLocaleState.current = [{ languageCode: "en", languageTag: "en-US", regionCode: "US" }];
  });

  it("submits valid English sign-in values and returns home", async () => {
    const onSubmit = jest.fn(() => Promise.resolve(undefined));
    const screen = await render(<AuthForm isRegistration={false} onSubmit={onSubmit} />);

    await fireEvent.changeText(screen.getByPlaceholderText("Email"), "person@example.com");
    await fireEvent.changeText(screen.getByPlaceholderText("Password"), "password123");
    await fireEvent.press(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ email: "person@example.com", name: "", password: "password123" }),
    );
    expect(mockRouter.replace).toHaveBeenCalledWith("/");
  });

  it("renders the registration form in Simplified Chinese", async () => {
    mockLocaleState.current = [{ languageCode: "zh", languageTag: "zh-Hans-CN", regionCode: "CN" }];
    const screen = await render(<AuthForm isRegistration onSubmit={() => Promise.resolve(undefined)} />);

    expect(screen.getByPlaceholderText("姓名")).toBeOnTheScreen();
    expect(screen.getByPlaceholderText("邮箱")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "创建账户" })).toBeOnTheScreen();
  });
});
