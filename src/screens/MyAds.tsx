import { Loading } from "@/components/Loading";
import { ProductCard } from "@/components/ProductCard";
import { TextBold } from "@/components/TextBold";
import { TextRegular } from "@/components/TextRegular";
import { ProductDTO } from "@/dtos/ProductDTO";
import { AppNavigatorRoutesProps } from "@/routes/app.routes";
import { api } from "@/services/api";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Plus } from "phosphor-react-native";
import { useCallback, useState } from "react";
import { FlatList, Pressable, View } from "react-native";

export function MyAds() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductDTO[]>([]);

  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  function handleCreateAdNavigate() {
    navigate("createAd");
  }

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await api.get("users/products");

      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const totalAds = products.length;

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );
  return (
    <View className="bg-gray-6 flex-1 pt-16 px-6">
      <View className="flex-row justify-between items-center">
        <View />
        <TextBold text="Meus anúncios" type="LARGE" className="text-center" />
        <Pressable onPress={handleCreateAdNavigate}>
          <Plus size={24} />
        </Pressable>
      </View>

      <View className="flex-row justify-between items-center mt-10 mb-5">
        <TextRegular
          text={totalAds === 1 ? "1 anúncio" : `${totalAds} anúncios`}
        />
        <TextRegular text="Select" />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            name={item.name}
            price={item.price}
            isNew={item.is_new}
            productImages={item.product_images}
          />
        )}
        numColumns={2}
        columnWrapperStyle={{ flex: 1, gap: 20, marginBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() =>
          !loading ? (
            <TextRegular
              text="Nenhum anúncio encontrado"
              className="text-center"
            />
          ) : null
        }
        ListFooterComponent={loading ? <Loading /> : null}
      />
    </View>
  );
}
