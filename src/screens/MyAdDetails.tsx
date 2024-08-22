import { Button } from "@/components/Button";
import { ButtonsContainer } from "@/components/ButtonsContainer";
import { ProductInfo } from "@/components/ProductInfo";
import { Loading } from "@/components/Loading";
import { Slider } from "@/components/Slider";
import { ProductDTO } from "@/dtos/ProductDTO";
import { useAuth } from "@/hooks/useAuth";
import { AppNavigatorRoutesProps } from "@/routes/app.routes";
import { TabRoutesNavigatorRoutesProps } from "@/routes/tab.routes";
import { api } from "@/services/api";
import { ConvertNumberToDecimal } from "@/utils/ConvertNumberToDecimal";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  ArrowLeft,
  PencilSimpleLine,
  Power,
  TrashSimple,
} from "phosphor-react-native";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { formatPrice } from "@/utils/FormatPrice";

interface RouteParams {
  id: string;
}

export function MyAdDetails() {
  const [isFetchingAd, setIsFetchingAd] = useState(false);
  const [isUpdatingAdStatus, setIsUpdatingAdStatus] = useState(false);
  const [isDeletingAd, setIsDeletingAd] = useState(false);
  const [product, setProduct] = useState<ProductDTO>({} as ProductDTO);
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const { user } = useAuth();

  const convertPriceToDecimal = ConvertNumberToDecimal(product.price);
  const formattedPrice = formatPrice(convertPriceToDecimal);

  const appNavigation = useNavigation<AppNavigatorRoutesProps>();
  const tabNavigation = useNavigation<TabRoutesNavigatorRoutesProps>();

  function handleBackNavigate() {
    tabNavigation.navigate("myAds");
  }

  function handleAdEditNavigate() {
    appNavigation.navigate("adEdit", { id });
  }

  async function handleDeleteAd() {
    try {
      setIsDeletingAd(true);
      await api.delete(`/products/${id}`);

      tabNavigation.navigate("myAds");
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeletingAd(false);
    }
  }

  async function toggleAdStatus() {
    try {
      setIsUpdatingAdStatus(true);
      await api.patch(`/products/${id}`, {
        is_active: !product.is_active,
      });

      fetchAdById();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingAdStatus(false);
    }
  }

  async function fetchAdById() {
    try {
      setIsFetchingAd(true);
      const response = await api.get(`/products/${id}`);

      setProduct(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingAd(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchAdById();
    }, [])
  );

  return (
    <View className="pt-16 flex-1 bg-gray-6">
      {isFetchingAd ? (
        <Loading />
      ) : (
        <>
          <View className="items-center justify-between flex-row px-6 mb-5">
            <Pressable onPress={handleBackNavigate}>
              <ArrowLeft size={24} />
            </Pressable>

            <Pressable onPress={handleAdEditNavigate}>
              <PencilSimpleLine size={24} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {product.product_images && (
              <Slider
                images={product.product_images}
                is_active={product.is_active}
              />
            )}

            <ProductInfo
              userName={user.name}
              userAvatar={user.avatar}
              name={product.name}
              description={product.description}
              acceptTrade={product.accept_trade}
              price={formattedPrice}
              paymentMethods={product.payment_methods}
              isNew={product.is_new}
            />
          </ScrollView>

          <ButtonsContainer>
            <Button
              type={product.is_active ? "black" : "purple"}
              onPress={toggleAdStatus}
              isLoading={isUpdatingAdStatus}
            >
              <Button.Icon>
                <Power size={16} color="#F7F7F8" />
              </Button.Icon>

              <Button.Text type="light_gray">
                {product.is_active ? "Desativar" : "Reativar"} anúncio
              </Button.Text>
            </Button>

            <Button
              type="gray"
              onPress={handleDeleteAd}
              isLoading={isDeletingAd}
            >
              <Button.Icon>
                <TrashSimple size={16} color="#1A181B" />
              </Button.Icon>

              <Button.Text type="dark_gray">Excluir anúncio</Button.Text>
            </Button>
          </ButtonsContainer>
        </>
      )}
    </View>
  );
}
