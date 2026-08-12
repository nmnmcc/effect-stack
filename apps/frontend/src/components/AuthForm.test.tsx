import { LocalizationProvider } from "@/lib/localization";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { AuthForm } from "./AuthForm";

describe("AuthForm", () => {
  it("shows the validation error before sending an invalid registration", () => {
    render(
      <MemoryRouter>
        <LocalizationProvider locale="en">
          <AuthForm mode="sign-up" />
        </LocalizationProvider>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "person@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Enter your name.");
  });

  it("renders the sign-in form in Simplified Chinese", () => {
    render(
      <MemoryRouter>
        <LocalizationProvider locale="zh-Hans">
          <AuthForm mode="sign-in" />
        </LocalizationProvider>
      </MemoryRouter>,
    );

    expect(screen.getByLabelText("邮箱")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "登录" })).toBeInTheDocument();
  });
});
