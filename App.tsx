import { StatusBar } from "react-native";
import "./global.css";
import {
  useFonts,
  Karla_400Regular,
  Karla_700Bold,
} from "@expo-google-fonts/karla";
import { Loading } from "@/components/Loading";
import { Routes } from "@/routes";
import Toast from "react-native-toast-message";
import { AuthContextProvider } from "@/contexts/AuthContext";

export default function App() {
  const [fontsLoaded] = useFonts({ Karla_400Regular, Karla_700Bold });
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={"transparent"}
        translucent
      />
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
      <Toast />
    </>
  );
}
