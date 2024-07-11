import { Loading } from "@/components/Loading";
import { ProductCard } from "@/components/ProductCard";
import { DropdownComponent } from "@/components/Dropdown";
import { TextBold } from "@/components/TextBold";
import { TextRegular } from "@/components/TextRegular";
import { ProductDTO } from "@/dtos/ProductDTO";
import { AppNavigatorRoutesProps } from "@/routes/app.routes";
import { api } from "@/services/api";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Plus } from "phosphor-react-native";
import { useCallback, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { ConvertNumberToDecimal } from "@/utils/ConvertNumberToDecimal";
import { formatPrice } from "@/utils/FormatPrice";

const filters = [
  { label: "Todos", value: "all" },
  { label: "Novo", value: "new" },
  { label: "Usado", value: "used" },
  { label: "Ativado", value: "on" },
  { label: "Desativado", value: "off" },
];

export function MyAds() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [filterValue, setFilterValue] = useState<string>(filters[0].value);

  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  function handleAdCreateNavigate() {
    navigate("adCreate");
  }

  function handleMyAdDetailsNavigate(id: string) {
    navigate("myAdDetails", { id });
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

  const filteredAds = products.filter((product: ProductDTO) => {
    switch (filterValue) {
      case "all":
        return true;
      case "new":
        return product.is_new;
      case "used":
        return !product.is_new;
      case "on":
        return product.is_active;
      case "off":
        return !product.is_active;
      default:
        return true;
    }
  });

  const totalAds = filteredAds.length;

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
        <Pressable onPress={handleAdCreateNavigate}>
          <Plus size={24} />
        </Pressable>
      </View>

      <View className="flex-row justify-between items-center mt-10 mb-5">
        <TextRegular
          text={totalAds === 1 ? "1 anúncio" : `${totalAds} anúncios`}
        />

        <DropdownComponent
          data={filters}
          value={filterValue}
          setValue={setFilterValue}
        />
      </View>

      <FlatList
        data={filteredAds}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const convertPriceToDecimal = ConvertNumberToDecimal(item.price);
          const formattedPrice = formatPrice(convertPriceToDecimal);

          return (
            <ProductCard
              id={item.id}
              name={item.name}
              price={formattedPrice}
              isNew={item.is_new}
              isActive={item.is_active}
              productImages={item.product_images}
              navigate={handleMyAdDetailsNavigate}
            />
          );
        }}
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
