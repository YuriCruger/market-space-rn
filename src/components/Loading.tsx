import { ActivityIndicator, View } from "react-native";

export function Loading() {
  return (
    <View className="flex-1 bg-gray-6 justify-center">
      <ActivityIndicator color="#647AC7" size="large" />
    </View>
  );
}
