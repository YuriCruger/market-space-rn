import { Image, Text, View } from "react-native";
import { ImageContainer } from "./ImageContainer";
import { TextBold } from "./TextBold";
import { TextRegular } from "./TextRegular";
import { PAYMENT_ICON } from "@/utils/PaymentMethods";
import { ProductConditionBadge } from "./ProductConditionBadge";
import { api } from "@/services/api";
import { PaymentMethods } from "@/dtos/ProductDTO";

interface ProductInfoProps {
  userAvatar: string;
  userName: string;
  isNew: boolean;
  name: string;
  price: string;
  description: string;
  acceptTrade: boolean;
  paymentMethods: PaymentMethods[];
}

export function ProductInfo({
  userAvatar,
  userName,
  isNew,
  name,
  price,
  description,
  acceptTrade,
  paymentMethods,
}: ProductInfoProps) {
  return (
    <View className="gap-6 my-5 px-6">
      <View className="flex-row items-center gap-2">
        <ImageContainer className="h-8 w-8 border-2">
          <Image
            className="w-full h-full"
            source={{ uri: `${api.defaults.baseURL}/images/${userAvatar}` }}
          />
        </ImageContainer>

        <Text className="text-sm font-karlaRegular text-gray-1">
          {userName}
        </Text>
      </View>

      <ProductConditionBadge isNewProduct={isNew} />

      <View className="flex-row items-center gap-2">
        <TextBold text={name} type="LARGE" className="flex-1" />

        <View className="gap-2 flex-row items-center">
          <Text className="text-blue-light font-karlaBold text-sm">R$</Text>
          <Text className="text-blue-light font-karlaBold text-xl">
            {price}
          </Text>
        </View>
      </View>

      <TextRegular text={description} />

      <View className="flex-row gap-2">
        <TextBold text="Aceita troca?" type="SMALL" />
        <TextRegular text={acceptTrade ? "Sim" : "Não"} />
      </View>

      <View className="gap-2">
        <TextBold text="Meios de pagamento:" type="SMALL" />
        {paymentMethods &&
          paymentMethods.map((payment) => (
            <View
              key={payment.key}
              className="flex-row gap-2 items-center mb-1"
            >
              {PAYMENT_ICON[payment.key as keyof typeof PAYMENT_ICON]}
              <TextRegular text={payment.name} />
            </View>
          ))}
      </View>
    </View>
  );
}
