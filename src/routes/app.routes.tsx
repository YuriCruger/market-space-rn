import { CreateAd } from "@/screens/CreateAd";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { HomeTabs } from "./homeTabs";
import { AdPreview } from "@/screens/AdPreview";

type AppRoutes = {
  home: undefined;
  createAd: undefined;
  adPreview: undefined;
};

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={HomeTabs} />
      <Screen name="createAd" component={CreateAd} />
      <Screen name="adPreview" component={AdPreview} />
    </Navigator>
  );
}
