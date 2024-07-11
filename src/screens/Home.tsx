import { ActiveListingsPanel } from "@/components/ActiveListingsPanel";
import { BottomSheetComponent } from "@/components/BottomSheetComponent";
import { HomeHeader } from "@/components/HomeHeader";
import { Input } from "@/components/Input";
import { Loading } from "@/components/Loading";
import { ProductCard } from "@/components/ProductCard";
import { TextRegular } from "@/components/TextRegular";
import { PaymentMethods, ProductDTO } from "@/dtos/ProductDTO";
import { useAuth } from "@/hooks/useAuth";
import { AppNavigatorRoutesProps } from "@/routes/app.routes";
import { api } from "@/services/api";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Faders, MagnifyingGlass } from "phosphor-react-native";
import { useCallback, useRef, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { ConvertNumberToDecimal } from "@/utils/ConvertNumberToDecimal";
import { formatPrice } from "@/utils/FormatPrice";

export type ConditionalTypes = "NEW" | "USED" | "";

export type AcceptTradeTypes = "true" | "false";

export function Home() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [userProducts, setUserProducts] = useState<ProductDTO[]>([]);
  const [searchText, setSearchText] = useState("");
  const [conditionalFilter, setConditionalFilter] =
    useState<ConditionalTypes>("");
  const [acceptTradeFilter, setAcceptTradeFilter] =
    useState<AcceptTradeTypes>("false");
  const [paymentMethodsFilter, setPaymentMethodsFilter] = useState<
    PaymentMethods[]
  >([]);

  const { user } = useAuth();

  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenBottomSheet = () => bottomSheetRef.current?.snapToIndex(0);

  const handleCloseBottomSheet = () => bottomSheetRef.current?.close();

  function handleAdDetailsNavigate(id: string) {
    navigate("adDetails", { id });
  }

  function handleConditionalFilter(conditional: ConditionalTypes) {
    if (conditionalFilter === conditional) {
      return setConditionalFilter("");
    }
    setConditionalFilter(conditional);
  }

  async function fetchUserProducts() {
    try {
      const response = await api.get("/users/products");

      setUserProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const activeUserProducts = userProducts.filter(
    (product) => product.is_active
  ).length;

  async function fetchProductsByFilter() {
    try {
      handleCloseBottomSheet();

      setLoading(true);

      const queryParams = new URLSearchParams();

      if (conditionalFilter) {
        const isNew = conditionalFilter === "NEW" ? "true" : "false";
        queryParams.append("is_new", isNew);
      }

      if (paymentMethodsFilter.length > 0) {
        paymentMethodsFilter.forEach((method) => {
          queryParams.append("payment_methods", method.key);
        });
      }

      queryParams.append("accept_trade", acceptTradeFilter);

      const response = await api.get(`/products?${queryParams.toString()}`);

      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProductsByTextFilter() {
    try {
      if (searchText === "") {
        return;
      }

      setLoading(true);

      const queryParams = new URLSearchParams();

      queryParams.append("query", searchText);

      const response = await api.get(`/products?${queryParams.toString()}`);

      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFiltersReset() {
    setSearchText("");
    setConditionalFilter("");
    setAcceptTradeFilter("false");
    setPaymentMethodsFilter([]);
    await fetchProducts();
    handleCloseBottomSheet();
  }

  async function fetchProducts() {
    try {
      if (searchText) {
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
      fetchUserProducts();
    }, [])
  );

  return (
    <View className="flex-1 pt-16 px-6 bg-gray-6">
      <View className="gap-8 flex-1">
        <HomeHeader user={user} />

        <View className="gap-3">
          <TextRegular text="Seus produtos anunciados para venda " />
          <ActiveListingsPanel activeProducts={activeUserProducts} />
        </View>

        <View className="gap-3">
          <TextRegular text="Compre produtos variados" />
          <View className="bg-gray-7 flex-row items-center pr-4 rounded-md gap-3">
            <Input
              placeholder="Buscar anúncio"
              className="flex-1"
              onChangeText={setSearchText}
            />

            <Pressable onPress={fetchProductsByTextFilter}>
              <MagnifyingGlass size={20} />
            </Pressable>

            <View className="w-0.5 h-5 bg-gray-5" />

            <Pressable onPress={handleOpenBottomSheet}>
              <Faders size={20} />
            </Pressable>
          </View>
        </View>

        <FlatList
          data={products}
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
                userAvatar={item.user.avatar}
                productImages={item.product_images}
                navigate={handleAdDetailsNavigate}
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

      <BottomSheetComponent
        ref={bottomSheetRef}
        fetchProductsByFilter={fetchProductsByFilter}
        handleCloseBottomSheet={handleCloseBottomSheet}
        handleConditionalFilter={handleConditionalFilter}
        handleFiltersReset={handleFiltersReset}
        conditionalFilter={conditionalFilter}
        acceptTradeFilter={acceptTradeFilter}
        setAcceptTradeFilter={setAcceptTradeFilter}
        paymentMethodsFilter={paymentMethodsFilter}
        setPaymentMethodsFilter={setPaymentMethodsFilter}
      />
    </View>
  );
}
