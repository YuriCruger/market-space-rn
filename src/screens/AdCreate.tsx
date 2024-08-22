import { Button } from "@/components/Button";
import { FormInput } from "@/components/FormInput";
import { Input } from "@/components/Input";
import { InputErrorMessage } from "@/components/InputErrorMessage";
import { PaymentCheckBox } from "@/components/PaymentCheckBox";
import { TextBold } from "@/components/TextBold";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { CheckBox, Switch } from "@rneui/base";
import { ArrowLeft, Plus } from "phosphor-react-native";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, Text, View } from "react-native";
import { z } from "zod";
import { ProductImage } from "@/components/ProductImage";
import { AppNavigatorRoutesProps } from "@/routes/app.routes";
import { paymentOptions } from "@/utils/PaymentMethods";
import {
  saveStorageAd,
  removeStorageAd,
  getStorageAd,
} from "@/storage/storageCreateAd";
import { PaymentMethods } from "@/dtos/ProductDTO";
import { FileDTO } from "@/dtos/FileDTO";
import { ButtonsContainer } from "@/components/ButtonsContainer";
import { ImagePickerComponent } from "@/components/ImagePicker";

const imageSchema = z.object({
  name: z.string(),
  type: z.string(),
  uri: z.string(),
});

const adCreateSchema = z.object({
  product_images: z.array(imageSchema).min(1, "Selecione pelo menos uma foto"),
  name: z.string().trim().min(1, "Insira um título").default(""),
  description: z.string().trim().min(1, "Insira uma descrição").default(""),
  price: z
    .string()
    .trim()
    .min(1, "Insira um preço")
    .transform((val) => val.replace(",", "."))
    .pipe(z.coerce.number().min(1, "Insira um preço válido maior ou igual a 1"))
    .or(z.number())
    .default(""),
  payment_methods: z
    .array(
      z.object({
        key: z.string(),
        name: z.string(),
      })
    )
    .min(1, "Selecione pelo menos um método de pagamento"),
  is_new: z
    .union([z.boolean(), z.undefined()])
    .refine((val) => val !== undefined, {
      message: "Selecione se o produto é novo ou usado",
    }),
  accept_trade: z.boolean().default(false),
});

export type AdCreateSchemaType = z.infer<typeof adCreateSchema>;

export function AdCreate() {
  const [isNewProduct, setIsNewProduct] = useState<boolean | undefined>(
    undefined
  );
  const [isTradeable, setIsTradeable] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods[]>([]);
  const [productImages, setProductImages] = useState<FileDTO[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitted },
  } = useForm<AdCreateSchemaType>({
    defaultValues: {},
    resolver: zodResolver(adCreateSchema),
  });

  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  async function handleExitAndCleanup() {
    await removeStorageAd();
    navigate("tabRoutes");
  }

  function handlePhotoSelected(data: FileDTO) {
    setProductImages((prevState) => [...prevState, data]);
  }

  async function handlePreviewNavigate(values: AdCreateSchemaType) {
    await saveStorageAd(values);

    navigate("createAdPreview");
  }

  function handleNewProductCheck() {
    setIsNewProduct(true);
    setValue("is_new", true);
    trigger("is_new");
  }

  function handleUsedProductCheck() {
    setIsNewProduct(false);
    setValue("is_new", false);
    trigger("is_new");
  }

  function handleRemovePhoto(productName: string) {
    setProductImages((prevState) =>
      prevState.filter((productImage) => productImage.name !== productName)
    );
  }

  async function fetchStorageData() {
    const response = await getStorageAd();

    if (Object.keys(response).length === 0) {
      return;
    }

    setValue("product_images", response.product_images);
    setValue("name", response.name);
    setValue("description", response.description);
    setValue("is_new", response.is_new);
    setValue("price", response.price);
    setValue("accept_trade", response.accept_trade);
    setValue("payment_methods", response.payment_methods);
    setIsNewProduct(response.is_new);
    setPaymentMethods(response.payment_methods);
    setProductImages(response.product_images);
  }

  useEffect(() => {
    setValue("payment_methods", paymentMethods);
    if (isSubmitted) {
      trigger("payment_methods");
    }
  }, [paymentMethods]);

  useEffect(() => {
    setValue("product_images", productImages);
    if (isSubmitted) {
      trigger("product_images");
    }
  }, [productImages]);

  useEffect(() => {
    setValue("accept_trade", isTradeable);
  }, [isTradeable]);

  useFocusEffect(
    useCallback(() => {
      fetchStorageData();
    }, [])
  );

  return (
    <View className="flex-1 bg-gray-6 pt-16">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-5">
          <View className="relative flex-row items-center justify-center">
            <Pressable
              className="absolute left-0"
              onPress={handleExitAndCleanup}
            >
              <ArrowLeft size={24} />
            </Pressable>
            <TextBold text="Criar anúncio" type="LARGE" />
          </View>

          <View className="mt-6 gap-8">
            <View>
              <TextBold text="Imagens" />
              <Text className="text-gray-3 text-sm font-karlaRegular mt-1">
                Escolha até 3 imagens para mostrar o quando o seu produto é
                incrível!
              </Text>

              <View className="flex-row gap-2">
                {productImages.map((product) => (
                  <ProductImage
                    key={product.name}
                    id={product.name}
                    handleRemovePhoto={handleRemovePhoto}
                    source={{ uri: product.uri }}
                  />
                ))}

                {productImages.length < 3 && (
                  <View className="w-[100px] h-[100px] bg-gray-5 items-center justify-center mt-4 rounded-md">
                    <ImagePickerComponent onImagePick={handlePhotoSelected}>
                      <Plus size={24} color="#9F9BA1" />
                    </ImagePickerComponent>
                  </View>
                )}
              </View>
            </View>
            {errors.product_images?.message && (
              <InputErrorMessage message={errors.product_images?.message} />
            )}

            <View className="gap-4">
              <TextBold text="Sobre o produto" />

              <FormInput
                control={control}
                name={"name"}
                placeholder={"Título do anúncio"}
              />

              <Controller
                control={control}
                name={"description"}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState: { error },
                }) => (
                  <>
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Descrição do produto"
                      multiline={true}
                      numberOfLines={6}
                      textAlignVertical="top"
                    />
                    {error?.message && (
                      <InputErrorMessage message={error.message} />
                    )}
                  </>
                )}
              />

              <View className="flex-row">
                <CheckBox
                  checked={isNewProduct === undefined ? false : isNewProduct}
                  onPress={handleNewProductCheck}
                  checkedIcon="dot-circle-o"
                  checkedColor="#647AC7"
                  uncheckedIcon="circle-o"
                  uncheckedColor="#9F9BA1"
                  containerStyle={{ backgroundColor: undefined }}
                  size={24}
                  title="Produto novo"
                  titleProps={{
                    style: {
                      fontSize: 16,
                      color: "#3E3A40",
                      fontFamily: "Karla_400Regular",
                    },
                  }}
                />

                <CheckBox
                  checked={isNewProduct === undefined ? false : !isNewProduct}
                  onPress={handleUsedProductCheck}
                  checkedIcon="dot-circle-o"
                  checkedColor="#647AC7"
                  uncheckedIcon="circle-o"
                  uncheckedColor="#9F9BA1"
                  containerStyle={{ backgroundColor: undefined }}
                  size={24}
                  title="Produto usado"
                  titleProps={{
                    style: {
                      fontSize: 16,
                      color: "#3E3A40",
                      fontFamily: "Karla_400Regular",
                    },
                  }}
                />
              </View>

              {errors.is_new?.message && (
                <InputErrorMessage message={errors.is_new.message} />
              )}

              <TextBold text="Venda" />

              <View className="relative">
                <Text className="absolute left-4 z-10 top-1/2 -translate-y-1/2">
                  R$
                </Text>

                <Controller
                  control={control}
                  name={"price"}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      className="pl-12"
                      value={value !== undefined ? String(value) : ""}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Valor do produto"
                      keyboardType="numeric"
                    />
                  )}
                />
              </View>
              {errors.price?.message && (
                <InputErrorMessage message={errors.price.message} />
              )}

              <TextBold text="Aceita troca?" type="SMALL" />

              <Switch
                value={isTradeable}
                onValueChange={setIsTradeable}
                thumbColor={"#F7F7F8"}
                trackColor={{ true: "#647AC7", false: "#D9D8DA" }}
                style={{
                  alignSelf: "flex-start",
                }}
              />

              <TextBold text="Meios de pagamento aceitos" type="SMALL" />

              <View>
                {paymentOptions.map((option) => (
                  <PaymentCheckBox
                    key={option.key}
                    paymentMethods={paymentMethods}
                    setPaymentMethods={setPaymentMethods}
                    paymentKey={option.key}
                    paymentName={option.name}
                  />
                ))}
                {errors.payment_methods?.message && (
                  <InputErrorMessage message={errors.payment_methods.message} />
                )}
              </View>
            </View>
          </View>
        </View>

        <ButtonsContainer flexDirection="ROW">
          <View className="flex-1">
            <Button type="gray" onPress={handleExitAndCleanup}>
              <Button.Text type="dark_gray">Cancelar</Button.Text>
            </Button>
          </View>

          <View className="flex-1">
            <Button type="black" onPress={handleSubmit(handlePreviewNavigate)}>
              <Button.Text type="light_gray">Avançar</Button.Text>
            </Button>
          </View>
        </ButtonsContainer>
      </ScrollView>
    </View>
  );
}
