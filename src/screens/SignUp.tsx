import { Image, Pressable, ScrollView, Text, View } from "react-native";
import logoImg from "@/assets/logo.png";
import avatarImg from "@/assets/avatar.png";
import { PencilSimpleLine, SpinnerGap, User } from "phosphor-react-native";
import { PasswordIcon } from "@/components/PasswordIcon";
import { useState } from "react";
import { Button } from "@/components/Button";
import { AuthPrompt } from "@/components/AuthPrompt";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@/routes/auth.routes";
import { FormInput } from "@/components/FormInput";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-toast-message";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppError";

const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const MAX_IMAGE_SIZE_MB = 5;

const signUpSchema = z
  .object({
    name: z.string().trim().min(1, "Insira um nome"),
    email: z
      .string()
      .trim()
      .min(1, "Insira um e-mail")
      .email("Insira um e-mail válido"),
    phone: z
      .string()
      .trim()
      .min(10, "Insira um número de telefone válido com DDD")
      .max(15, "Insira um número de telefone válido com no máximo 15 dígitos")
      .regex(phoneRegex, "Insira um número de telefone válido"),
    password: z.string().trim().min(6, "Insira uma senha com até 6 dígitos"),
    confirm_password: z.string(),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "A senha não confere",
        path: ["confirm_password"],
      });
    }
  });

type SignUpSchemaProps = z.infer<typeof signUpSchema>;

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userPhoto, setUserPhoto] = useState<any>(null);

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const { control, handleSubmit } = useForm<SignUpSchemaProps>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  function togglePasswordVisibility() {
    setShowPassword((prevState) => !prevState);
  }

  function toggleConfirmPasswordVisibility() {
    setShowConfirmPassword((prevState) => !prevState);
  }

  function handleLoginPage() {
    navigation.navigate("signIn");
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

      const fileExtension = photoURI.split(".").pop();

      const photoFile = {
        name: `hash-.${fileExtension}`.toLowerCase(),
        uri: photoURI,
        type: `${photoType}/${fileExtension}`,
      } as any;

      setUserPhoto(photoFile);
    } catch (error) {
      console.error("Error selecting photo:", error);
    }
  }

  async function handleSignUp(values: SignUpSchemaProps) {
    try {
      setIsLoading(true);
      const data = new FormData();

      if (userPhoto) {
        data.append("avatar", userPhoto);
      }

      data.append("name", values.name);
      data.append("email", values.email);
      data.append("tel", values.phone);
      data.append("password", values.password);

      await api.post("/users", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível cadastrar. Tente novamente mais tarde.";

      Toast.show({
        type: "error",
        text1: title,
        text1Style: { fontSize: 16 },
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="bg-gray-6 flex-1  px-12">
        <View className="mt-16 items-center">
          <Image source={logoImg} className="w-16 h-10" />
          <Text className="text-gray-1 font-karlaBold text-xl mt-3 mb-2">
            Boas vindas!
          </Text>
          <Text className="text-gray-2 text-sm text-center">
            Crie sua conta e use o espaço para comprar itens variados e vender
            seus produtos
          </Text>
        </View>

        <View className="relative items-center mt-8 mb-4">
          <View className="h-[88px] w-[88px] rounded-full border-4 border-blue-light bg-gray-5 items-center justify-center overflow-hidden">
            {userPhoto ? (
              <Image source={userPhoto} className="w-full h-full" />
            ) : (
              <User size={48} color="#9F9BA1" weight="bold" />
            )}
          </View>

          <Pressable
            onPress={handlePhotoSelected}
            className="absolute left-[55%] bottom-0 bg-blue-light rounded-full h-10 w-10 items-center justify-center "
          >
            <PencilSimpleLine size={16} color="white" />
          </Pressable>
        </View>

        <View className="gap-4">
          <View>
            <FormInput control={control} name={"name"} placeholder={"Nome"} />
          </View>
          <View>
            <FormInput
              control={control}
              name={"email"}
              placeholder={"E-mail"}
            />
          </View>
          <View>
            <FormInput
              control={control}
              name={"phone"}
              placeholder={"Telefone"}
            />
          </View>

          <PasswordIcon
            isVisible={showPassword}
            toggleVisibility={togglePasswordVisibility}
          >
            <FormInput
              control={control}
              name={"password"}
              placeholder={"Senha"}
              isPassword={!showPassword}
            />
          </PasswordIcon>

          <PasswordIcon
            isVisible={showConfirmPassword}
            toggleVisibility={toggleConfirmPasswordVisibility}
          >
            <FormInput
              control={control}
              name={"confirm_password"}
              placeholder={"Confirmar senha"}
              isPassword={!showConfirmPassword}
            />
          </PasswordIcon>
        </View>

        <View className="mt-6">
          <Button
            type="black"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          >
            {isLoading ? (
              <View className="animate-spin">
                <Button.Icon>
                  <SpinnerGap size={24} color="#EDECEE" />
                </Button.Icon>
              </View>
            ) : (
              <Button.Text type="light_gray">Criar</Button.Text>
            )}
          </Button>
        </View>

        <View className="mt-12 gap-4">
          <AuthPrompt title="Já tem uma conta?" />
          <Button type="gray" onPress={handleLoginPage}>
            <Button.Text type="dark_gray">Ir para o login</Button.Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
