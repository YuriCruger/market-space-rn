import { Image, ScrollView, View } from "react-native";
import logoImg from "@/assets/logo.png";
import { PencilSimpleLine, User } from "phosphor-react-native";
import { PasswordIcon } from "@/components/PasswordIcon";
import { useState } from "react";
import { Button } from "@/components/Button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@/routes/auth.routes";
import { FormInput } from "@/components/FormInput";
import Toast from "react-native-toast-message";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppError";
import { ImageContainer } from "@/components/ImageContainer";
import { TextBold } from "@/components/TextBold";
import { TextRegular } from "@/components/TextRegular";
import { ImagePickerComponent } from "@/components/ImagePicker";
import { FileDTO } from "@/dtos/FileDTO";

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

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

type SignUpSchemaType = z.infer<typeof signUpSchema>;

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userPhoto, setUserPhoto] = useState<FileDTO>({} as FileDTO);

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const { control, handleSubmit } = useForm<SignUpSchemaType>({
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

  function handlePhotoSelected(data: FileDTO) {
    setUserPhoto(data);
  }

  async function handleSignUp(values: SignUpSchemaType) {
    try {
      setIsLoading(true);
      const data = new FormData();

      if (userPhoto.name) {
        data.append("avatar", userPhoto as any);
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

      navigation.navigate("signIn");
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
    <View className="bg-gray-6 flex-1 px-12 pb-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mt-16 items-center">
          <Image source={logoImg} className="w-16 h-10" />
          <TextBold text="Boas vindas!" type="LARGE" className="mt-3 mb-2" />

          <TextRegular
            text="Crie sua conta e use o espaço para comprar itens variados e vender
            seus produtos"
            className="text-center"
          />
        </View>

        <View className="relative items-center mt-8 mb-4">
          <ImageContainer>
            {userPhoto.name ? (
              <Image source={userPhoto} className="w-full h-full" />
            ) : (
              <User size={48} color="#9F9BA1" weight="bold" />
            )}
          </ImageContainer>

          <View className="absolute left-[55%] bottom-0 bg-blue-light rounded-full h-10 w-10 items-center justify-center">
            <ImagePickerComponent onImagePick={handlePhotoSelected}>
              <PencilSimpleLine size={16} color="white" />
            </ImagePickerComponent>
          </View>
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
            <Button.Text type="light_gray">Criar</Button.Text>
          </Button>
        </View>

        <View className="mt-12 gap-4">
          <TextRegular text="Já tem uma conta?" className="text-center" />
          <Button type="gray" onPress={handleLoginPage}>
            <Button.Text type="dark_gray">Ir para o login</Button.Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
