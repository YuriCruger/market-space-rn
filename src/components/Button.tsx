import { ReactNode } from "react";
import {
  Pressable,
  Text,
  TextProps,
  TouchableOpacityProps,
  View,
} from "react-native";
import { Loading } from "./Loading";
import { SpinnerIcon } from "./SpinnerIcon";

type ButtonProps = TouchableOpacityProps & {
  children: ReactNode;
  type: "purple" | "gray" | "black";
  isLoading?: boolean;
};

type ButtonTextProps = TextProps & {
  children: ReactNode;
  type: "light_gray" | "dark_gray";
};

type ButtonIconProps = {
  children: ReactNode;
};

function Button({ children, type, isLoading, ...rest }: ButtonProps) {
  return (
    <Pressable
      disabled={isLoading}
      className={`px-3 h-12 gap-2 rounded-md justify-center items-center ${
        type === "purple"
          ? "bg-blue-light"
          : type === "gray"
          ? "bg-gray-5"
          : "bg-gray-1"
      } ${isLoading ? "opacity-90" : "opacity-100"}`}
      {...rest}
    >
      <View className="flex-row items-center gap-2">
        {isLoading ? <SpinnerIcon /> : <>{children}</>}
      </View>
    </Pressable>
  );
}

function ButtonText({ children, type, ...rest }: ButtonTextProps) {
  return (
    <Text
      className={`font-karlaBold text-sm ${
        type === "light_gray"
          ? "text-gray-7"
          : type === "dark_gray"
          ? "text-gray-2"
          : ""
      }`}
      {...rest}
    >
      {children}
    </Text>
  );
}

function ButtonIcon({ children }: ButtonIconProps) {
  return children;
}

Button.Text = ButtonText;
Button.Icon = ButtonIcon;

export { Button };
