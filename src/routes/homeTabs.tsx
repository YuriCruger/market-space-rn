import { useAuth } from "@/hooks/useAuth";
import { Home } from "@/screens/Home";
import { MyAds } from "@/screens/MyAds";
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { House, SignOut, Tag } from "phosphor-react-native";
import { Platform } from "react-native";

type HomeTabsRoutes = {
  homeTab: undefined;
  myAds: undefined;
  logout: undefined;
};

export type HomeTabsNavigatorRoutesProps =
  BottomTabNavigationProp<HomeTabsRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<HomeTabsRoutes>();

export function HomeTabs() {
  const { signOut } = useAuth();

  return (
    <Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#3E3A40",
        tabBarInactiveTintColor: "#9F9BA1",
        tabBarStyle: {
          backgroundColor: "#F7F7F8",
          borderTopWidth: 0,
          height: Platform.OS === "android" ? "auto" : 72,
          paddingBottom: 28,
          paddingTop: 20,
        },
      }}
    >
      <Screen
        name="homeTab"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <House size={24} weight="bold" color={color} />
          ),
        }}
      />
      <Screen
        name="myAds"
        component={MyAds}
        options={{
          tabBarIcon: ({ color }) => (
            <Tag size={24} weight="bold" color={color} />
          ),
        }}
      />

      <Screen
        name="logout"
        component={Home}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            signOut();
          },
        }}
        options={{
          tabBarIcon: () => <SignOut size={24} weight="bold" color="#E07878" />,
        }}
      />
    </Navigator>
  );
}
