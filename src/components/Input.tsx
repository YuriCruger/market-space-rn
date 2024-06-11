import { TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {}

export function Input({ ...rest }: InputProps) {
  return (
    <TextInput
      className="bg-gray-7 rounded-md h-12 px-4 text-gray-2"
      placeholderTextColor={"#9F9BA1"}
      {...rest}
    />
  );
}
