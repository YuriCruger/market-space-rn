import { AdsCard } from "@/components/AdsCard";
import { HomeHeader } from "@/components/HomeHeader";
import { Input } from "@/components/Input";
import { Loading } from "@/components/Loading";
import { ProductCard } from "@/components/ProductCard";
import { TextRegular } from "@/components/TextRegular";
import { ProductDTO } from "@/dtos/ProductDTO";
import { api } from "@/services/api";
import { useFocusEffect } from "@react-navigation/native";
import { Faders, MagnifyingGlass } from "phosphor-react-native";
import { useCallback, useState } from "react";
import { FlatList, Pressable, View } from "react-native";

export function Home() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [filterText, setFilterText] = useState("");

  async function fetchProductsByFilter() {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams();

      if (filterText) {
        queryParams.append("query", filterText);
      }

      const response = await api.get(`/products?${queryParams.toString()}`);

      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProducts() {
    try {
      if (filterText) {
        return;
      }
      setLoading(true);
      const response = await api.get("/products");

      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  return (
    <View className="flex-1 pt-16 px-6 bg-gray-6">
      <View className="gap-8 flex-1">
        <HomeHeader />

        <View className="gap-3">
          <TextRegular text="Seus produtos anunciados para venda " />
          <AdsCard />
        </View>

        <View className="gap-3">
          <TextRegular text="Compre produtos variados" />
          <View className="bg-gray-7 flex-row items-center pr-4 rounded-md gap-3">
            <Input
              placeholder="Buscar anúncio"
              className="flex-1"
              onChangeText={setFilterText}
            />

            <Pressable onPress={fetchProductsByFilter}>
              <MagnifyingGlass size={20} />
            </Pressable>

            <View className="w-0.5 h-5 bg-gray-5" />
            <Faders size={20} />
          </View>
        </View>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              name={item.name}
              price={item.price}
              isNew={item.is_new}
              userAvatar={item.user.avatar}
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
    </View>
  );
}
