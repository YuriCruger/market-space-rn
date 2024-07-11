import { Button } from "@/components/Button";
import { Slider } from "@/components/Slider";
import { TextBold } from "@/components/TextBold";
import { AppNavigatorRoutesProps } from "@/routes/app.routes";
import {
  storageCreateAdGet,
  storageCreateAdRemove,
} from "@/storage/storageCreateAd";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ArrowLeft, Tag } from "phosphor-react-native";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Loading } from "@/components/Loading";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppError";
import Toast from "react-native-toast-message";
import { useAuth } from "@/hooks/useAuth";
import { ProductInfo } from "@/components/ProductInfo";
import { AdCreateSchemaType } from "./AdCreate";
import { ButtonsContainer } from "@/components/ButtonsContainer";
import { ConvertPriceToInt } from "@/utils/ConvertPriceToInt";
import { formatPrice } from "@/utils/FormatPrice";

interface AdCreatePreviewSchemaType extends Omit<AdCreateSchemaType, "price"> {
  price: string;
}

export function CreateAdPreview() {
  const [isFetchingStorage, setIsFetchingStorage] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const [adValues, setAdValues] = useState<AdCreatePreviewSchemaType>(
    {} as AdCreatePreviewSchemaType
  );

  const { user, isLoadingUserStorageData } = useAuth();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleBack() {
    navigation.goBack();
  }

  async function fetchStorageData() {
    try {
      setIsFetchingStorage(true);
      const storageAd = await storageCreateAdGet();

      const formattedAd = {
        ...storageAd,
        price: formatPrice(storageAd.price),
      };

      setAdValues(formattedAd);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchingStorage(false);
    }
  }

  async function handlePublishAd(values: AdCreatePreviewSchemaType) {
    try {
      setIsPublishing(true);

      const convertPriceToInt = ConvertPriceToInt(values.price);

      const paymentMethodKeys = values.payment_methods.map((method) =>
        method.key.toLowerCase().trim()
      );

      const response = await api.post("/products", {
        name: values.name,
        description: values.description,
        price: convertPriceToInt,
        is_new: values.is_new,
        accept_trade: values.accept_trade,
        payment_methods: paymentMethodKeys,
      });

      const product_id = response.data.id;

      const productImagesUploadForm = new FormData();

      for (let i = 0; i < values.product_images.length; i++) {
        const photo = values.product_images[i];

        productImagesUploadForm.append("images", photo as any);
      }

      productImagesUploadForm.append("product_id", product_id);

      await api.post("/products/images", productImagesUploadForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await storageCreateAdRemove();

      navigation.navigate("myAdDetails", { id: product_id });
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
      setIsPublishing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchStorageData();
    }, [])
  );

  if (isFetchingStorage || isLoadingUserStorageData) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-gray-6">
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {adValues.product_images && <Slider images={adValues.product_images} />}
        <ProductInfo
          userName={user.name}
          userAvatar={user.avatar}
          name={adValues.name}
          description={adValues.description}
          acceptTrade={adValues.accept_trade}
          price={adValues.price.toString()}
          paymentMethods={adValues.payment_methods}
          isNew={adValues.is_new ? adValues.is_new : false}
        />
      </ScrollView>

      <ButtonsContainer flexDirection="ROW">
        <View className="flex-1">
          <Button type="gray" onPress={handleBack}>
            <Button.Icon>
              <ArrowLeft size={16} />
            </Button.Icon>
            <Button.Text type="dark_gray">Voltar e editar</Button.Text>
          </Button>
        </View>

        <View className="flex-1">
          <Button
            type="purple"
            onPress={() => handlePublishAd(adValues)}
            isLoading={isPublishing}
          >
            <Button.Icon>
              <Tag size={16} color="#F7F7F8" />
            </Button.Icon>
            <Button.Text type="light_gray">Publicar</Button.Text>
          </Button>
        </View>
      </ButtonsContainer>
    </View>
  );
}
