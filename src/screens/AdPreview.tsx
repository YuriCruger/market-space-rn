import { Button } from "@/components/Button";
import { ImageContainer } from "@/components/ImageContainer";
import { Slider } from "@/components/Slider";
import { SpinnerIcon } from "@/components/SpinnerIcon";
import { TextRegular } from "@/components/TextRegular";
import { TextBold } from "@/components/TextBold";
import { AppNavigatorRoutesProps } from "@/routes/app.routes";
import { storageAdGet, storageAdRemove } from "@/storage/storageAd";
import { PAYMENT_ICON } from "@/utils/PaymentMethods";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ArrowLeft, Tag } from "phosphor-react-native";
import { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { CreateAdSchemaType } from "./CreateAd";
import { Loading } from "@/components/Loading";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppError";
import Toast from "react-native-toast-message";
import { useAuth } from "@/hooks/useAuth";
import defaulUserPhotoImg from "@/assets/avatar.png";

export function AdPreview() {
  const [isLoading, setIsLoading] = useState(false);

  const [adValues, setAdValues] = useState<CreateAdSchemaType>(
    {} as CreateAdSchemaType
  );

  const { user, isLoadingUserStorageData } = useAuth();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleBackToEdit() {
    navigation.navigate("createAd");
  }

  async function fetchStorageData() {
    try {
      setIsLoading(true);
      const ad = await storageAdGet();
      setAdValues(ad);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePublishAd(values: CreateAdSchemaType) {
    try {
      setIsLoading(true);
      const convertPriceToInt = Number(values.price) * 100;

      const response = await api.post("/products", {
        name: values.title,
        description: values.description,
        price: convertPriceToInt,
        is_new: values.isNewProduct ?? values.isUsedProduct,
        accept_trade: values.isTradeable,
        payment_methods: values.paymentMethods,
      });

      const product_id = response.data.id;

      const productImagesUploadForm = new FormData();

      for (let i = 0; i < values.images.length; i++) {
        const photo = values.images[i];

        productImagesUploadForm.append("images", photo as any);
      }

      productImagesUploadForm.append("product_id", product_id);

      await api.post("/products/images", productImagesUploadForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await storageAdRemove();
      navigation.navigate("home");
    } catch (error) {
      const isAppError = error instanceof AppError;
      const errorMessage = isAppError
        ? error.message
        : "Não foi possível criar o anúncio. Tente novamente mais tarde.";
      Toast.show({
        type: "error",
        text1: errorMessage,
        text1Style: { fontSize: 16 },
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchStorageData();
    }, [])
  );

  if (isLoading || isLoadingUserStorageData) {
    return <Loading />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="bg-blue-light h-[121px] w-full items-center pt-16">
        <TextBold
          text="Pré visualização do anúncio"
          type="MEDIUM"
          className="text-gray-7"
        />
        <Text className="font-karlaRegular text-gray-7 text-sm mt-1">
          É assim que seu produto vai aparecer!
        </Text>
      </View>

      <View>{adValues.images && <Slider images={adValues.images} />}</View>

      <View className="flex-1 bg-gray-7 px-6 py-10 gap-6 ">
        <View className="flex-row items-center gap-2">
          <ImageContainer className="h-8 w-8 border-2">
            <Image
              className="w-full h-full"
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/images/${user.avatar}` }
                  : defaulUserPhotoImg
              }
            />
          </ImageContainer>

          <Text className="text-sm font-karlaRegular text-gray-1">
            {user.name}
          </Text>
        </View>

        <View className="bg-gray-5 w-[50px] rounded-full px-2 py-0.5 items-center justify-center">
          <Text className="text-xs font-karlaBold text-gray-2 uppercase">
            {adValues.isNewProduct && "novo"}
            {adValues.isUsedProduct && "usado"}
          </Text>
        </View>

        <View className="flex-row items-center">
          <TextBold text={adValues.title} type="LARGE" className="flex-1" />

          <View className="gap-2 flex-row items-center">
            <Text className="text-blue-light font-karlaBold text-sm">R$</Text>
            <Text className="text-blue-light font-karlaBold text-xl">
              {Number(adValues.price).toFixed(2)}
            </Text>
          </View>
        </View>

        <TextRegular text={adValues.description} />

        <View className="flex-row gap-2">
          <TextBold text="Aceita troca?" type="SMALL" />
          <TextRegular text={adValues.isTradeable ? "Sim" : "Não"} />
        </View>

        <View className="gap-2">
          <TextBold text="Meios de pagamento:" type="SMALL" />
          {adValues.paymentMethods &&
            adValues.paymentMethods.map((payment) => (
              <View key={payment} className="flex-row gap-2 items-center mb-1">
                {PAYMENT_ICON[payment as keyof typeof PAYMENT_ICON]}
                <TextRegular text={payment} />
              </View>
            ))}
        </View>

        <View className="flex-row gap-3 mt-8">
          <View className="flex-1">
            <Button type="gray" onPress={handleBackToEdit}>
              <Button.Icon>
                <ArrowLeft size={16} />
              </Button.Icon>
              <Button.Text type="dark_gray">Voltar e editar</Button.Text>
            </Button>
          </View>

          <View className="flex-1">
            <Button type="purple" onPress={() => handlePublishAd(adValues)}>
              {isLoading ? (
                <SpinnerIcon />
              ) : (
                <>
                  <Button.Icon>
                    <Tag size={16} color="#F7F7F8" />
                  </Button.Icon>
                  <Button.Text type="light_gray">Publicar</Button.Text>
                </>
              )}
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
