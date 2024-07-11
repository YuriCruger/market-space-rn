import { Image, Pressable, View } from "react-native";
import { TextRegular } from "./TextRegular";
import { TextBold } from "./TextBold";
import { ImageContainer } from "./ImageContainer";
import { ProductConditionBadge } from "./ProductConditionBadge";
import { api } from "@/services/api";
import { ProductImages } from "@/dtos/ProductDTO";
import { ConvertNumberToDecimal } from "@/utils/ConvertNumberToDecimal";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  isNew: boolean;
  isActive?: boolean;
  userAvatar?: string;
  productImages: ProductImages[];
  navigate: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  price,
  isNew,
  isActive = true,
  userAvatar,
  productImages,
  navigate,
}: ProductCardProps) {
  return (
    <View className={"flex-1 relative"}>
      <Pressable
        onPress={() => navigate(id)}
        className="w-full h-[100px] rounded-md overflow-hidden mb-1 max-w-[160px]"
      >
        {userAvatar && (
          <ImageContainer className="absolute z-10 top-2 left-2 h-6 w-6 border-2 ">
            <Image
              source={{ uri: `${api.defaults.baseURL}/images/${userAvatar}` }}
              className="w-full h-full"
            />
          </ImageContainer>
        )}

        <View className="absolute z-10 top-2 right-2">
          <ProductConditionBadge
            isNewProduct={isNew}
            color={isNew ? "BLUE" : "GRAY_DARK"}
          />
        </View>

        {!isActive && (
          <View className="absolute z-30 bottom-2 left-2">
            <TextBold
              text="Anúncio desativado"
              className="text-gray-7 text-xs"
            />
          </View>
        )}

        {!isActive && (
          <View className="bg-gray-2 w-full h-full absolute z-20 opacity-45" />
        )}

        <Image
          source={{
            uri: `${api.defaults.baseURL}/images/${productImages[0].path}`,
          }}
          className={`w-full h-full`}
        />
      </Pressable>

      <TextRegular text={name} className={`${!isActive && "text-gray-4"}`} />

      <View className="flex-row items-center gap-2 px-0.5">
        <TextBold
          text="R$"
          className={`text-xs  ${isActive ? "text-gray-1" : "text-gray-4"}`}
        />
        <TextBold
          text={price}
          className={`${isActive ? "text-gray-1" : "text-gray-4"}`}
        />
      </View>
    </View>
  );
}
