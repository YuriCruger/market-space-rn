import { Button } from "@/components/Button";
import { ButtonsContainer } from "@/components/ButtonsContainer";
import { ProductInfo } from "@/components/ProductInfo";
import { Loading } from "@/components/Loading";
import { Slider } from "@/components/Slider";
import { TextBold } from "@/components/TextBold";
import { ProductDTO } from "@/dtos/ProductDTO";
import { AppNavigatorRoutesProps } from "@/routes/app.routes";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppError";
import { ConvertNumberToDecimal } from "@/utils/ConvertNumberToDecimal";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { ArrowLeft, WhatsappLogo } from "phosphor-react-native";
import { useCallback, useState } from "react";
import { Linking, Pressable, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import { formatPrice } from "@/utils/FormatPrice";

interface RouteParams {
  id: string;
}

export function AdDetails() {
  const [isWhatsAppLoading, setIsWhatsAppLoading] = useState(false);
  const [isFetchingAd, setIsFetchingAd] = useState(true);
  const [product, setProduct] = useState<ProductDTO>({} as ProductDTO);

  const route = useRoute();
  const { id } = route.params as RouteParams;

  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  function handleHomeNavigate() {
    navigate("home");
  }

  async function handleContact() {
    try {
      setIsWhatsAppLoading(true);

      const message = "Olá! Vi seu anúncio no Marketspace e tenho interesse.";

      await Linking.openURL(
        `http://api.whatsapp.com/send?phone=${product.user.tel}&text=${message}`
      );
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Erro ao abrir o aplicativo. Tente novamente mais tarde.",
        text1Style: { fontSize: 16 },
      });
    } finally {
      setIsWhatsAppLoading(false);
    }
  }

  async function fetchProductById() {
    try {
      setIsFetchingAd(true);
      const response = await api.get(`/products/${id}`);

      setProduct(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível encontrar o anúncio. Tente novamente mais tarde.";

      Toast.show({
        type: "error",
        text1: title,
        text1Style: { fontSize: 16 },
      });
    } finally {
      setIsFetchingAd(false);
    }
  }

  const convertPriceToDecimal = ConvertNumberToDecimal(product.price);
  const formattedPrice = formatPrice(convertPriceToDecimal);

  useFocusEffect(
    useCallback(() => {
      fetchProductById();
    }, [])
  );

  return (
    <>
      {isFetchingAd ? (
        <Loading />
      ) : (
        <View className="pt-16 bg-gray-6 flex-1">
          <Pressable onPress={handleHomeNavigate} className="ml-6 mb-5">
            <ArrowLeft size={24} />
          </Pressable>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Slider images={product.product_images} />

            <ProductInfo
              userName={product.user.name}
              userAvatar={product.user.avatar}
              name={product.name}
              description={product.description}
              acceptTrade={product.accept_trade}
              price={formattedPrice}
              paymentMethods={product.payment_methods}
              isNew={product.is_new}
            />
          </ScrollView>

          <ButtonsContainer flexDirection="ROW">
            <View className="flex-1 flex-row items-center gap-2">
              <TextBold text="R$" type="SMALL" className="text-blue" />
              <TextBold
                text={formattedPrice}
                type="LARGE"
                className="text-blue"
              />
            </View>

            <View className="flex-1">
              <Button
                type="purple"
                onPress={handleContact}
                isLoading={isWhatsAppLoading}
              >
                <Button.Icon>
                  <WhatsappLogo size={16} color="#F7F7F8" weight="fill" />
                </Button.Icon>
                <Button.Text type="light_gray">Entrar em contato</Button.Text>
              </Button>
            </View>
          </ButtonsContainer>
        </View>
      )}
    </>
  );
}
