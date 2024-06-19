import { cn } from "@/utils/clsx";
import { TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {}

export function Input({ className, ...rest }: InputProps) {
  return (
    <TextInput
      className={cn("bg-gray-7 rounded-md py-3 px-4 text-gray-2", className)}
      placeholderTextColor={"#9F9BA1"}
      {...rest}
    />
  );
}
