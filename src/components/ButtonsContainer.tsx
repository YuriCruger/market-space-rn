import { ReactNode } from "react";
import { View } from "react-native";

interface ButtonsContainerProps {
  children: ReactNode;
  flexDirection?: "COLUMN" | "ROW";
}

export function ButtonsContainer({
  children,
  flexDirection = "COLUMN",
}: ButtonsContainerProps) {
  return (
    <View
      className={`gap-3 mb-5 px-6 ${flexDirection === "ROW" && "flex-row"}`}
    >
      {children}
    </View>
  );
}
