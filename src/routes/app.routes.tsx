import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { HomeTabs } from "./homeTabs";
import { AdCreate } from "@/screens/AdCreate";
import { MyAdDetails } from "@/screens/MyAdDetails";
import { AdEdit } from "@/screens/AdEdit";
import { AdDetails } from "@/screens/AdDetails";
import { CreateAdPreview } from "@/screens/CreateAdPreview";
import { EditAdPreview } from "@/screens/EditAdPreview";

type AppRoutes = {
  home: undefined;
  adCreate: undefined;
  createAdPreview: undefined;
  editAdPreview: {
    id: string;
  };
  myAdDetails: {
    id: string;
  };
  adEdit: {
    id: string;
  };
  adDetails: {
    id: string;
  };
};

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={HomeTabs} />
      <Screen name="adCreate" component={AdCreate} />
      <Screen name="createAdPreview" component={CreateAdPreview} />
      <Screen name="editAdPreview" component={EditAdPreview} />
      <Screen name="adEdit" component={AdEdit} />
      <Screen name="adDetails" component={AdDetails} />
      <Screen name="myAdDetails" component={MyAdDetails} />
    </Navigator>
  );
}
