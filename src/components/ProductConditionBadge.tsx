import { View } from "react-native";
import { TextBold } from "./TextBold";

interface ProductConditionBadgeProps {
  isNewProduct: boolean;
  type?: "GRAY_LIGHT" | "GRAY_DARK" | "BLUE";
}

export function ProductConditionBadge({
  isNewProduct,
  type = "GRAY_LIGHT",
}: ProductConditionBadgeProps) {
  return (
    <View
      className={`w-[50px] rounded-full px-2 py-0.5 items-center justify-center ${
        type === "GRAY_LIGHT"
          ? "bg-gray-5"
          : type === "GRAY_DARK"
          ? "bg-gray-2"
          : "bg-blue"
      }`}
    >
      <TextBold
        text={isNewProduct ? "novo" : "usado"}
        className={`text-xs uppercase ${
          type !== "GRAY_LIGHT" ? "text-gray-7" : "text-gray-2"
        }`}
      />
    </View>
  );
}
