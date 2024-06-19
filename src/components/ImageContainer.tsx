import { cn } from "@/utils/clsx";
import { ReactNode } from "react";
import { View, ViewProps } from "react-native";

interface ImageContainerProps extends ViewProps {
  children: ReactNode;
}

export function ImageContainer({ children, className }: ImageContainerProps) {
  return (
    <View
      className={cn(
        "h-[88px] w-[88px] rounded-full border-4 border-blue-light bg-gray-5 items-center justify-center overflow-hidden",
        className
      )}
    >
      {children}
    </View>
  );
}
