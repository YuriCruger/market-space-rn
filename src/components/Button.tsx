import { ReactNode } from "react";
import {
  Pressable,
  Text,
  TextProps,
  TouchableOpacityProps,
} from "react-native";

type ButtonProps = TouchableOpacityProps & {
  children: ReactNode;
  type: "purple" | "gray" | "black";
};

type ButtonTextProps = TextProps & {
  children: ReactNode;
  type: "light_gray" | "dark_gray";
};

type ButtonIconProps = {
  children: ReactNode;
};

function Button({ children, type, ...rest }: ButtonProps) {
  return (
    <Pressable
      className={`px-3 h-12 gap-2 rounded-md justify-center items-center ${
        type === "purple"
          ? "bg-blue-light"
          : type === "gray"
          ? "bg-gray-5"
          : "bg-gray-1"
      }`}
      {...rest}
    >
      {children}
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
