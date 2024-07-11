import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { TextBold } from "@/components/TextBold";
import { ProductConditionBadge } from "@/components/ProductConditionBadge";
import { Pressable, View } from "react-native";
import { X } from "phosphor-react-native";
import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { ButtonsContainer } from "./ButtonsContainer";
import { Button } from "./Button";
import { AcceptTradeTypes, ConditionalTypes } from "@/screens/Home";
import { Switch } from "@rneui/base";
import { PaymentCheckBox } from "./PaymentCheckBox";
import { paymentOptions } from "@/utils/PaymentMethods";
import { PaymentMethods } from "@/dtos/ProductDTO";

interface BottomSheetComponentProps {
  fetchProductsByFilter: () => void;
  handleCloseBottomSheet: () => void;
  handleConditionalFilter: (conditional: ConditionalTypes) => void;
  handleFiltersReset: () => void;
  conditionalFilter: ConditionalTypes;
  acceptTradeFilter: AcceptTradeTypes;
  setAcceptTradeFilter: React.Dispatch<React.SetStateAction<AcceptTradeTypes>>;
  paymentMethodsFilter: PaymentMethods[];
  setPaymentMethodsFilter: React.Dispatch<
    React.SetStateAction<PaymentMethods[]>
  >;
}

export const BottomSheetComponent = forwardRef<
  BottomSheet,
  BottomSheetComponentProps
>(
  (
    {
      fetchProductsByFilter,
      handleCloseBottomSheet,
      handleConditionalFilter,
      handleFiltersReset,
      conditionalFilter,
      acceptTradeFilter,
      setAcceptTradeFilter,
      paymentMethodsFilter,
      setPaymentMethodsFilter,
    },
    ref
  ) => {
    const snapPoints = useMemo(() => ["70%"], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      []
    );

    return (
      <BottomSheet
        ref={ref}
        enablePanDownToClose
        enableDynamicSizing
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#9F9BA1" }}
        backgroundStyle={{ backgroundColor: "#EDECEE", shadowColor: "#1A181B" }}
      >
        <BottomSheetScrollView>
          <BottomSheetView className="flex-1 bg-gray-6 ">
            <View className="flex-1 p-6 gap-6">
              <View className="flex-row justify-between">
                <TextBold text="Filtrar anúncios" type="LARGE" />

                <Pressable onPress={handleCloseBottomSheet}>
                  <X size={24} color="#9F9BA1" />
                </Pressable>
              </View>

              <View className="gap-3">
                <TextBold text="Condição" type="SMALL" />

                <View className="flex-row gap-2">
                  <Pressable onPress={() => handleConditionalFilter("NEW")}>
                    <ProductConditionBadge
                      isNewProduct={true}
                      type="SECONDARY"
                      color={
                        conditionalFilter === "NEW" ? "BLUE" : "GRAY_LIGHT"
                      }
                      isSelected={conditionalFilter === "NEW"}
                    />
                  </Pressable>

                  <Pressable onPress={() => handleConditionalFilter("USED")}>
                    <ProductConditionBadge
                      isNewProduct={false}
                      type="SECONDARY"
                      color={
                        conditionalFilter === "USED" ? "BLUE" : "GRAY_LIGHT"
                      }
                      isSelected={conditionalFilter === "USED"}
                    />
                  </Pressable>
                </View>
              </View>

              <View className="gap-3">
                <TextBold text="Aceita troca?" />

                <Switch
                  value={acceptTradeFilter === "true" ? true : false}
                  onValueChange={(value) =>
                    value
                      ? setAcceptTradeFilter("true")
                      : setAcceptTradeFilter("false")
                  }
                  thumbColor={"#F7F7F8"}
                  trackColor={{ true: "#647AC7", false: "#D9D8DA" }}
                  style={{
                    alignSelf: "flex-start",
                  }}
                />
              </View>

              <View className="gap-3">
                {paymentOptions.map((option) => (
                  <PaymentCheckBox
                    key={option.key}
                    paymentMethods={paymentMethodsFilter}
                    setPaymentMethods={setPaymentMethodsFilter}
                    paymentKey={option.key}
                    paymentName={option.name}
                  />
                ))}
              </View>
            </View>

            <ButtonsContainer flexDirection="ROW">
              <View className="flex-1">
                <Button type="gray" onPress={handleFiltersReset}>
                  <Button.Text type="dark_gray">Resetar filtros</Button.Text>
                </Button>
              </View>

              <View className="flex-1">
                <Button type="black" onPress={fetchProductsByFilter}>
                  <Button.Text type="light_gray">Aplicar filtros</Button.Text>
                </Button>
              </View>
            </ButtonsContainer>
          </BottomSheetView>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);
