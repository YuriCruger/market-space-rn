import { Text } from "react-native";

interface InputErrorMessageProps {
  message: string;
}

export function InputErrorMessage({ message }: InputErrorMessageProps) {
  return <Text className="text-red-light text-sm">{message}</Text>;
}
