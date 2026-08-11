import { useAppColors } from "@/lib/theme";
import { Host } from "@expo/ui";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ScreenHost({ children }: { readonly children: ReactNode }) {
  const colors = useAppColors();

  return (
    <SafeAreaView edges={["bottom"]} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.centered}>
        <Host style={styles.host}>{children}</Host>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignSelf: "center",
    flex: 1,
    maxWidth: 720,
    width: "100%",
  },
  host: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
