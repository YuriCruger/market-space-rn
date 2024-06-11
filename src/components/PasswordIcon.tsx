import { Eye, EyeSlash } from "phosphor-react-native";
import { ReactNode } from "react";
import { Pressable, View } from "react-native";

interface PasswordIconProps {
  children: ReactNode;
  isVisible: boolean;
  toggleVisibility: () => void;
}

export function PasswordIcon({
  isVisible = false,
  toggleVisibility,
  children,
}: PasswordIconProps) {
  return (
    <View className="relative">
      {children}
      <Pressable
        className="absolute right-4 translate-y-1/2"
        onPress={toggleVisibility}
      >
        {isVisible ? <EyeSlash size={20} /> : <Eye size={20} />}
      </Pressable>
    </View>
  );
}
