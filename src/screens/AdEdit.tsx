import { Button } from "@/components/Button";
import { ButtonsContainer } from "@/components/ButtonsContainer";
import { FormInput } from "@/components/FormInput";
import { ImagePickerComponent } from "@/components/ImagePicker";
import { Input } from "@/components/Input";
import { InputErrorMessage } from "@/components/InputErrorMessage";
import { Loading } from "@/components/Loading";
import { PaymentCheckBox } from "@/components/PaymentCheckBox";
import { ProductImage } from "@/components/ProductImage";
import { TextBold } from "@/components/TextBold";
import { FileDTO } from "@/dtos/FileDTO";
import { EditImages, PaymentMethods, ProductImages } from "@/dtos/ProductDTO";
import { AppNavigatorRoutesProps } from "@/routes/app.routes";
import { api } from "@/services/api";
import {
  storageDeletedImagesRemove,
  storageDeletedImagesSave,
} from "@/storage/storageDeletedImages";
import {
  storageEditAdGet,
  storageEditAdSave,
  storageEditAdRemove,
} from "@/storage/storageEditAd";
import { ConvertNumberToDecimal } from "@/utils/ConvertNumberToDecimal";
import { formatPrice } from "@/utils/FormatPrice";
import { paymentOptions } from "@/utils/PaymentMethods";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { CheckBox, Switch } from "@rneui/base";
import { ArrowLeft, Plus } from "phosphor-react-native";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, Text, View } from "react-native";
import { z } from "zod";

interface RouteParams {
  id: string;
}

const adEditSchema = z.object({
  product_images: z
    .array(
      z.object({
        isNew: z.boolean(),
        id: z.string().optional(),
        path: z.string().optional(),
        uri: z.string().optional(),
        type: z.string().optional(),
        name: z.string().optional(),
      })
    )
    .min(1, "Selecione pelo menos uma foto"),
  name: z.string().trim().min(1, "Insira um título"),
  description: z.string().trim().min(1, "Insira uma descrição"),
  price: z
    .string()
    .trim()
    .min(1, "Insira um preço")
    .transform((val) => val.replace(",", "."))
    .pipe(z.coerce.number().min(1, "Insira um preço válido maior ou igual a 1"))
    .or(z.number()),
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

export type AdEditSchemaType = z.infer<typeof adEditSchema>;

export function AdEdit() {
  const [isFetchingAd, setIsFetchingAd] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState<boolean | undefined>(
    undefined
  );
  const [isTradeable, setIsTradeable] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods[]>([]);
  const [productImages, setProductImages] = useState<EditImages[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const route = useRoute();
  const { id } = route.params as RouteParams;

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<AdEditSchemaType>({
    resolver: zodResolver(adEditSchema),
  });

  async function handleExitAndCleanup() {
    await storageEditAdRemove();
    await storageDeletedImagesRemove();
    navigation.goBack();
  }

  async function handlePreviewNavigate(values: AdEditSchemaType) {
    await storageEditAdSave(values);
    await storageDeletedImagesSave(deletedImages);

    navigation.navigate("editAdPreview", { id: id });
  }

  function handleRemovePhoto(id: string) {
    setProductImages((prevState) =>
      prevState.filter((image) =>
        image.isNew ? image.name !== id : image.id !== id
      )
    );
    setDeletedImages((prevState) => [...prevState, id]);
  }

  function handleSwitchIsTradeable() {
    setIsTradeable((prevState) => {
      const newState = !prevState;
      setValue("accept_trade", newState);
      return newState;
    });
  }

  function handlePhotoSelected(data: FileDTO) {
    const newImage = { ...data, isNew: true };
    setProductImages((prevState) => [...prevState, newImage]);
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

  function fetchStorageData(data: AdEditSchemaType) {
    const convertPriceToDecimal = ConvertNumberToDecimal(data.price);

    setValue("product_images", data.product_images);
    setValue("name", data.name);
    setValue("description", data.description);
    setValue("is_new", data.is_new);
    setValue("price", Number(convertPriceToDecimal));
    setValue("accept_trade", data.accept_trade);

    setIsTradeable(data.accept_trade);
    setIsNewProduct(data.is_new);
    setPaymentMethods(data.payment_methods);
    setProductImages(data.product_images);
  }

  async function fetchAdById() {
    try {
      setIsFetchingAd(true);

      const storageAd = await storageEditAdGet();

      if (storageAd.name) {
        return fetchStorageData(storageAd);
      }

      const response = await api.get(`/products/${id}`);

      const convertToDecimal = ConvertNumberToDecimal(response.data.price);

      const imagesWithIsNew = response.data.product_images.map(
        (image: ProductImages) => ({
          ...image,
          isNew: false,
        })
      );

      setValue("product_images", imagesWithIsNew);
      setValue("name", response.data.name);
      setValue("description", response.data.description);
      setValue("is_new", response.data.is_new);
      setValue("price", convertToDecimal);
      setValue("accept_trade", response.data.accept_trade);

      setIsTradeable(response.data.accept_trade);
      setIsNewProduct(response.data.is_new);
      setPaymentMethods(response.data.payment_methods);
      setProductImages(imagesWithIsNew);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingAd(false);
    }
  }

  useEffect(() => {
    setValue("payment_methods", paymentMethods);
    trigger("payment_methods");
  }, [paymentMethods]);

  useEffect(() => {
    setValue("product_images", productImages);
    trigger("product_images");
  }, [productImages]);

  useFocusEffect(
    useCallback(() => {
      fetchAdById();
    }, [])
  );

  return (
    <>
      {isFetchingAd ? (
        <Loading />
      ) : (
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
                <TextBold text="Editar anúncio" type="LARGE" />
              </View>

              <View className="mt-6 gap-8">
                <View>
                  <TextBold text="Imagens" />
                  <Text className="text-gray-3 text-sm font-karlaRegular mt-1">
                    Escolha até 3 imagens para mostrar o quando o seu produto é
                    incrível!
                  </Text>

                  <View className="flex-row gap-2">
                    {productImages.map((image, index) => (
                      <ProductImage
                        key={index}
                        id={image.isNew ? image.name || "" : image.id || ""}
                        handleRemovePhoto={() =>
                          handleRemovePhoto(
                            image.isNew ? image.name || "" : image.id || ""
                          )
                        }
                        source={{
                          uri: image.isNew
                            ? image.uri || ""
                            : `${api.defaults.baseURL}/images/${image.path}` ||
                              "",
                        }}
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
                      checked={
                        isNewProduct === undefined ? false : isNewProduct
                      }
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
                      checked={
                        isNewProduct === undefined ? false : !isNewProduct
                      }
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
                    onValueChange={handleSwitchIsTradeable}
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
                      <InputErrorMessage
                        message={errors.payment_methods.message}
                      />
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
                <Button
                  type="black"
                  onPress={handleSubmit(handlePreviewNavigate)}
                >
                  <Button.Text type="light_gray">Avançar</Button.Text>
                </Button>
              </View>
            </ButtonsContainer>
          </ScrollView>
        </View>
      )}
    </>
  );
}
