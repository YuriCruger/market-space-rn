import { View } from "react-native";
import { TextBold } from "./TextBold";
import { X } from "phosphor-react-native";

interface ProductConditionBadgeProps {
  isNewProduct: boolean;
  color?: "GRAY_LIGHT" | "GRAY_DARK" | "BLUE";
  type?: "PRIMARY" | "SECONDARY";
  isSelected?: boolean;
}

export function ProductConditionBadge({
  isNewProduct,
  color = "GRAY_LIGHT",
  type = "PRIMARY",
  isSelected,
}: ProductConditionBadgeProps) {
  return (
    <View
      className={`rounded-full px-2 items-center justify-center
        ${
          type === "PRIMARY"
            ? "w-[50px] py-0.5"
            : `w-[76px] py-1.5 flex-row px-3 ${isSelected && "justify-between"}`
        }
         ${
           color === "GRAY_LIGHT"
             ? "bg-gray-5"
             : color === "GRAY_DARK"
             ? "bg-gray-2"
             : "bg-blue"
         }`}
    >
      <TextBold
        text={isNewProduct ? "novo" : "usado"}
        className={`text-xs uppercase ${
          color !== "GRAY_LIGHT" ? "text-gray-7" : "text-gray-2"
        }`}
      />

      {isSelected && (
        <View className="bg-gray-7 rounded-full p-2 w-4 h-4 items-center justify-center">
          <X size={12} color="#364D9D" />
        </View>
      )}
    </View>
  );
}
