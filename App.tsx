import { StatusBar } from "react-native";
import "./global.css";
import {
  useFonts,
  Karla_400Regular,
  Karla_700Bold,
} from "@expo-google-fonts/karla";
import { Loading } from "@/components/Loading";
import { Routes } from "@/routes";

export default function App() {
  const [fontsLoaded] = useFonts({ Karla_400Regular, Karla_700Bold });
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={"transparent"}
        translucent
      />
      {fontsLoaded ? <Routes /> : <Loading />}
    </>
  );
}
