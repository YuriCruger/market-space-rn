import { Text } from "react-native";

interface AuthPromptProps {
  title: string;
}

export function AuthPrompt({ title }: AuthPromptProps) {
  return <Text className="text-gray-2 text-sm text-center">{title}</Text>;
}
