import { Image, View } from "react-native";
import { TextRegular } from "./TextRegular";
import { TextBold } from "./TextBold";
import { ImageContainer } from "./ImageContainer";
import { ProductConditionBadge } from "./ProductConditionBadge";
import { api } from "@/services/api";
import { ProductImages } from "@/dtos/ProductDTO";

interface ProductCardProps {
  name: string;
  price: number;
  isNew: boolean;
  userAvatar?: string;
  productImages: ProductImages[];
}

export function ProductCard({
  name,
  price,
  isNew,
  userAvatar,
  productImages,
}: ProductCardProps) {
  const convertPriceToDecimal = price / 100;

  return (
    <View className="flex-1">
      <View className="w-full h-[100px] rounded-md overflow-hidden mb-1 max-w-[160px]">
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
            type={isNew ? "BLUE" : "GRAY_DARK"}
          />
        </View>

        <Image
          source={{
            uri: `${api.defaults.baseURL}/images/${productImages[0].path}`,
          }}
          className="w-full h-full"
        />
      </View>

      <TextRegular text={name} />

      <View className="flex-row items-center gap-2 px-0.5">
        <TextBold text="R$" className="text-xs" color="GRAY_1" />
        <TextBold text={convertPriceToDecimal.toFixed(2)} color="GRAY_1" />
      </View>
    </View>
  );
}
