import { Button } from "@/components/Button";
import { Slider } from "@/components/Slider";
import { TextBold } from "@/components/TextBold";
import { AppNavigatorRoutesProps } from "@/routes/app.routes";
import { storageEditAdGet, storageEditAdRemove } from "@/storage/storageEditAd";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { ArrowLeft, Tag } from "phosphor-react-native";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Loading } from "@/components/Loading";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppError";
import Toast from "react-native-toast-message";
import { useAuth } from "@/hooks/useAuth";
import { ProductInfo } from "@/components/ProductInfo";
import { ButtonsContainer } from "@/components/ButtonsContainer";
import { ConvertNumberToDecimal } from "@/utils/ConvertNumberToDecimal";
import { AdEditSchemaType } from "./AdEdit";
import {
  storageDeletedImagesGet,
  storageDeletedImagesRemove,
} from "@/storage/storageDeletedImages";
import { formatPrice } from "@/utils/FormatPrice";
import { ConvertPriceToInt } from "@/utils/ConvertPriceToInt";

interface RouteParams {
  id: string;
}

interface AdEditPreviewSchemaType extends Omit<AdEditSchemaType, "price"> {
  price: string;
}

export function EditAdPreview() {
  const [isFetchingStorage, setIsFetchingStorage] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const [adValues, setAdValues] = useState<AdEditPreviewSchemaType>(
    {} as AdEditPreviewSchemaType
  );
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const route = useRoute();
  const { id } = route.params as RouteParams;

  const { user, isLoadingUserStorageData } = useAuth();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleBack() {
    navigation.goBack();
  }

  async function fetchStorageData() {
    try {
      setIsFetchingStorage(true);
      const storageAd = await storageEditAdGet();
      const storageDeletedImages = await storageDeletedImagesGet();

      const formattedAd = {
        ...storageAd,
        price: formatPrice(storageAd.price),
      };

      setAdValues(formattedAd);
      setDeletedImages(storageDeletedImages);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchingStorage(false);
    }
  }

  async function handleEditAd(values: AdEditPreviewSchemaType) {
    try {
      setIsPublishing(true);

      const convertPriceToInt = ConvertPriceToInt(values.price);

      const paymentMethodKeys = values.payment_methods.map(
        (method) => method.key
      );

      await api.put(`/products/${id}`, {
        name: values.name,
        description: values.description,
        price: convertPriceToInt,
        is_new: values.is_new,
        accept_trade: values.accept_trade,
        payment_methods: paymentMethodKeys,
      });

      const newImages = values.product_images.filter((image) => image.isNew);

      if (newImages.length > 0) {
        const productImagesUploadForm = new FormData();

        for (let i = 0; i < newImages.length; i++) {
          const photo = newImages[i];
          productImagesUploadForm.append("images", photo as any);
        }

        productImagesUploadForm.append("product_id", id);

        await api.post("/products/images", productImagesUploadForm, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (deletedImages.length > 0) {
        await api.delete("products/images", {
          data: {
            productImagesIds: deletedImages,
          },
        });
      }

      await storageEditAdRemove();
      await storageDeletedImagesRemove();

      navigation.navigate("myAdDetails", { id: id });
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
          price={adValues.price}
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
            onPress={() => handleEditAd(adValues)}
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
