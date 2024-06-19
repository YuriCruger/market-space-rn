import { ArrowRight, Tag } from "phosphor-react-native";
import { Pressable, View } from "react-native";
import { TextBold } from "./TextBold";
import { TextRegular } from "./TextRegular";
import { useNavigation } from "@react-navigation/native";
import { HomeTabsNavigatorRoutesProps } from "@/routes/homeTabs";

export function AdsCard() {
  const { navigate } = useNavigation<HomeTabsNavigatorRoutesProps>();

  function handleMyAdsNavigate() {
    navigate("myAds");
  }

  return (
    <Pressable
      onPress={handleMyAdsNavigate}
      className="bg-blue-light/15 flex-row items-center py-3 pl-4 pr-5 rounded-md"
    >
      <Tag size={22} color="#364D9D" />

      <View className="flex-1 ml-4">
        <TextBold text="4" type="LARGE" />
        <TextRegular text="anúncios ativos" type="SMALL" />
      </View>

      <View className="flex-row gap-2 items-center">
        <TextBold text="Meus anúncios" type="SMALL" className="text-blue" />
        <ArrowRight size={16} color="#364D9D" />
      </View>
    </Pressable>
  );
}
