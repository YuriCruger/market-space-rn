import { NavigationContainer } from "@react-navigation/native";
import { AuthRoutes } from "./auth.routes";
import { View } from "react-native";
import { AppRoutes } from "./app.routes";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/Loading";

export function Routes() {
  const { isLoadingUserStorageData, user } = useAuth();

  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-gray-6">
      <NavigationContainer>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </View>
  );
}
