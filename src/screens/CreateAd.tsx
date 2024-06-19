import { Button } from "@/components/Button";
import { FormInput } from "@/components/FormInput";
import { Input } from "@/components/Input";
import { InputErrorMessage } from "@/components/InputErrorMessage";
import { PaymentCheckBox } from "@/components/PaymentCheckBox";
import { SpinnerIcon } from "@/components/SpinnerIcon";
import { TextBold } from "@/components/TextBold";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { CheckBox, Switch } from "@rneui/base";
import { ArrowLeft, Plus } from "phosphor-react-native";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { MAX_IMAGE_SIZE_MB } from "@/utils/MaxImageSize";
import { ProductImage } from "@/components/ProductImage";
import * as CryptoJS from "crypto-js";
import { AppNavigatorRoutesProps } from "@/routes/app.routes";
import { paymentOptions } from "@/utils/PaymentMethods";
import {
  storageAdGet,
  storageAdRemove,
  storageAdSave,
} from "@/storage/storageAd";

const imageSchema = z.object({
  name: z.string(),
  type: z.string(),
  uri: z.string(),
});

const createAdSchema = z
  .object({
    images: z.array(imageSchema).min(1, "Selecione pelo menos uma foto"),
    title: z.string().trim().min(1, "Insira um título").default(""),
    description: z.string().trim().min(1, "Insira uma descrição").default(""),
    price: z
      .string()
      .trim()
      .min(1, "Insira um preço")
      .transform((val) => val.replace(",", "."))
      .pipe(
        z.coerce.number().min(1, "Insira um preço válido maior ou igual a 1")
      )
      .or(z.number())
      .default(""),
    paymentMethods: z
      .array(z.string())
      .min(1, "Selecione pelo menos um método de pagamento"),
    isNewProduct: z.boolean().default(false),
    isUsedProduct: z.boolean().default(false),
    isTradeable: z.boolean().default(false),
  })
  .refine((data) => data.isNewProduct !== data.isUsedProduct, {
    message: "Selecione se o produto é novo ou usado.",
    path: ["isNewProduct"],
  });

export type CreateAdSchemaType = z.infer<typeof createAdSchema>;

export function CreateAd() {
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [isUsedProduct, setIsUsedProduct] = useState(false);
  const [isTradeable, setIsTradeable] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [productPhotos, setProductPhotos] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors, isSubmitted, defaultValues },
  } = useForm<CreateAdSchemaType>({
    defaultValues: {},
    resolver: zodResolver(createAdSchema),
  });

  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  async function handleCancel() {
    await storageAdRemove();
    navigate("home");
  }

  function handleHomeNavigate() {
    navigate("home");
  }

  async function handlePreviewNavigate(values: CreateAdSchemaType) {
    await storageAdSave(values);

    navigate("adPreview");
  }

  function handleNewProductCheck() {
    setIsNewProduct(true);
    setIsUsedProduct(false);
    setValue("isNewProduct", true);
    setValue("isUsedProduct", false);
    trigger("isNewProduct");
  }

  function handleUsedProductCheck() {
    setIsNewProduct(false);
    setIsUsedProduct(true);
    setValue("isNewProduct", false);
    setValue("isUsedProduct", true);
    trigger("isNewProduct");
  }

  function handleRemovePhoto(productName: string) {
    setProductPhotos((prevState) =>
      prevState.filter((productPhoto) => productPhoto.name !== productName)
    );
  }

  function isImageTooLarge(size: number): boolean {
    const sizeInMB = size / 1024 / 1024;
    return sizeInMB > MAX_IMAGE_SIZE_MB;
  }

  async function handlePhotoSelected() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      const photoURI = photoSelected.assets[0].uri;
      const photoType = photoSelected.assets[0].type;

      if (photoURI) {
        const photoInfo = await FileSystem.getInfoAsync(photoURI);

        if (photoInfo.exists && isImageTooLarge(photoInfo.size)) {
          Toast.show({
            type: "error",
            text1: "Imagem muito grande",
            text2: "Selecione uma imagem até 5MB.",
            text1Style: { fontSize: 16 },
            text2Style: { fontSize: 12 },
          });
        }
      }

      const hash = CryptoJS.MD5(photoURI).toString();
      const fileExtension = photoURI.split(".").pop();

      const photoFile = {
        name: `photo-${hash}.${fileExtension}`.toLowerCase(),
        uri: photoURI,
        type: `${photoType}/${fileExtension}`,
      } as any;

      setProductPhotos((prevState) => [...prevState, photoFile]);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao selecionar a foto. Tente novamente mais tarde.",
        text1Style: { fontSize: 16 },
      });
    }
  }

  async function fetchStorageData() {
    const response = await storageAdGet();

    if (Object.keys(response).length === 0) {
      return;
    }

    setValue("images", response.images);
    setValue("title", response.title);
    setValue("description", response.description);
    setValue("isNewProduct", response.isNewProduct);
    setValue("isUsedProduct", response.isUsedProduct);
    setValue("price", response.price);
    setValue("isTradeable", response.isTradeable);
    setValue("paymentMethods", response.paymentMethods);
    setIsNewProduct(response.isNewProduct);
    setIsUsedProduct(response.isUsedProduct);
    setPaymentMethods(response.paymentMethods);
    setProductPhotos(response.images);
  }

  useEffect(() => {
    setValue("paymentMethods", paymentMethods);
    if (isSubmitted) {
      trigger("paymentMethods");
    }
  }, [paymentMethods]);

  useEffect(() => {
    setValue("images", productPhotos);
    if (isSubmitted) {
      trigger("images");
    }
  }, [productPhotos]);

  useEffect(() => {
    setValue("isTradeable", isTradeable);
  }, [isTradeable]);

  useFocusEffect(
    useCallback(() => {
      fetchStorageData();
    }, [])
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="pt-16 pb-6 px-6 bg-gray-6 flex-1">
        <View className="relative flex-row items-center justify-center">
          <Pressable className="absolute left-0" onPress={handleHomeNavigate}>
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
              {productPhotos.map((product) => (
                <ProductImage
                  key={product.name}
                  productPhoto={product}
                  handleRemovePhoto={handleRemovePhoto}
                />
              ))}

              {productPhotos.length < 3 && (
                <Pressable
                  onPress={handlePhotoSelected}
                  className="w-[100px] h-[100px] bg-gray-5 items-center justify-center mt-4 rounded-md"
                >
                  <Plus size={24} color="#9F9BA1" />
                </Pressable>
              )}
            </View>
          </View>
          {errors.images?.message && (
            <InputErrorMessage message={errors.images?.message} />
          )}

          <View className="gap-4">
            <TextBold text="Sobre o produto" />

            <FormInput
              control={control}
              name={"title"}
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
                checked={isNewProduct}
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
                checked={isUsedProduct}
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

            {errors.isNewProduct?.message && (
              <InputErrorMessage message={errors.isNewProduct.message} />
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
                  key={option.value}
                  paymentMethods={paymentMethods}
                  setPaymentMethods={setPaymentMethods}
                  value={option.value}
                  label={option.label}
                />
              ))}
              {errors.paymentMethods?.message && (
                <InputErrorMessage message={errors.paymentMethods.message} />
              )}
            </View>
          </View>
        </View>

        <View className="flex-row gap-3 mt-8">
          <View className="flex-1">
            <Button type="gray" onPress={handleCancel}>
              <Button.Text type="dark_gray">Cancelar</Button.Text>
            </Button>
          </View>

          <View className="flex-1">
            <Button type="black" onPress={handleSubmit(handlePreviewNavigate)}>
              <Button.Text type="light_gray">Avançar</Button.Text>
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
