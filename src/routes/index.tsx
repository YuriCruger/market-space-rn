import { NavigationContainer } from "@react-navigation/native";
import { AuthRoutes } from "./auth.routes";
import { View } from "react-native";

export function Routes() {
  return (
    <View className="flex-1 bg-gray-6">
      <NavigationContainer>
        <AuthRoutes />
      </NavigationContainer>
    </View>
  );
}
