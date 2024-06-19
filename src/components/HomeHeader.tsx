import { Image, View } from "react-native";
import { ImageContainer } from "./ImageContainer";
import { useAuth } from "@/hooks/useAuth";
import defaulUserPhotoImg from "@/assets/avatar.png";
import { api } from "@/services/api";
import { TextRegular } from "./TextRegular";
import { TextBold } from "./TextBold";
import { Button } from "./Button";
import { Plus } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@/routes/app.routes";

export function HomeHeader() {
  const { user } = useAuth();

  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  function handleCreateAdNavigate() {
    navigate("createAd");
  }

  return (
    <View className="flex-row items-center gap-2.5">
      <ImageContainer className="h-12 w-12 border-2">
        <Image
          className="w-full h-full"
          source={
            user.avatar
              ? { uri: `${api.defaults.baseURL}/images/${user.avatar}` }
              : defaulUserPhotoImg
          }
        />
      </ImageContainer>

      <View className="flex-1">
        <TextRegular text="Boas Vindas," type="LARGE" />
        <TextBold text={user.name.concat("!")} type="MEDIUM" />
      </View>

      <Button type="black" onPress={handleCreateAdNavigate}>
        <Button.Icon>
          <Plus size={16} color="#EDECEE" />
        </Button.Icon>
        <Button.Text type="light_gray">Criar anúncio</Button.Text>
      </Button>
    </View>
  );
}
