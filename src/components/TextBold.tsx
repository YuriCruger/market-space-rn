import { cn } from "@/utils/clsx";
import { Text } from "react-native";

interface TextBoldProps {
  text: string;
  type?: "SMALL" | "MEDIUM" | "LARGE";
  color?: "GRAY_1" | "GRAY_2";
  className?: string;
}

export function TextBold({
  text,
  type = "MEDIUM",
  color = "GRAY_2",
  className,
}: TextBoldProps) {
  return (
    <Text
      className={cn(
        ` font-karlaBold ${
          type === "SMALL"
            ? "text-sm"
            : type === "MEDIUM"
            ? "text-base"
            : "text-xl "
        } ${color === "GRAY_1" ? "text-gray-1" : "text-gray-2"}`,
        className
      )}
    >
      {text}
    </Text>
  );
}
