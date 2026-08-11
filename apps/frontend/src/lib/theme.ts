import { useMemo } from "react";
import { useColorScheme } from "react-native";

export interface AppColors {
  readonly background: string;
  readonly border: string;
  readonly danger: string;
  readonly muted: string;
  readonly surface: string;
  readonly text: string;
}

export const useAppColors = (): AppColors => {
  const isDark = useColorScheme() === "dark";

  return useMemo(
    () =>
      isDark
        ? {
            background: "#0b0f14",
            border: "#2b3440",
            danger: "#ff8a80",
            muted: "#9ba8b8",
            surface: "#141a22",
            text: "#f5f7fa",
          }
        : {
            background: "#f6f8fb",
            border: "#d7dee8",
            danger: "#b42318",
            muted: "#667085",
            surface: "#ffffff",
            text: "#17202a",
          },
    [isDark],
  );
};
