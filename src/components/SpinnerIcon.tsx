import { SpinnerGap } from "phosphor-react-native";
import { View } from "react-native";

export function SpinnerIcon() {
  return (
    <View className="animate-spin">
      <SpinnerGap size={24} color="#EDECEE" />
    </View>
  );
}
