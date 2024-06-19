import { cn } from "@/utils/clsx";
import { Text } from "react-native";

interface TextRegularProps {
  text: string;
  type?: "SMALL" | "MEDIUM" | "LARGE";
  className?: string;
}

export function TextRegular({
  text,
  type = "MEDIUM",
  className,
}: TextRegularProps) {
  return (
    <Text
      className={cn(
        ` text-gray-2 font-karlaRegular ${
          type === "SMALL"
            ? "text-xs"
            : type === "MEDIUM"
            ? "text-sm"
            : "text-base"
        }`,
        className
      )}
    >
      {text}
    </Text>
  );
}
