import { SpinnerGap } from "phosphor-react-native";
import { View } from "react-native";
import { Button } from "./Button";

export function SpinnerIcon() {
  return (
    <View className="animate-spin">
      <Button.Icon>
        <SpinnerGap size={24} color="#EDECEE" />
      </Button.Icon>
    </View>
  );
}
