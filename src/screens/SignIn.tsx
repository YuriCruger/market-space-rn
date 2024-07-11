import { Image, ScrollView, Text, View } from "react-native";
import logoImg from "@/assets/logo.png";
import { Button } from "@/components/Button";
import { PasswordIcon } from "@/components/PasswordIcon";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@/routes/auth.routes";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/FormInput";
import { AppError } from "@/utils/AppError";
import Toast from "react-native-toast-message";
import { useAuth } from "@/hooks/useAuth";
import { SpinnerIcon } from "@/components/SpinnerIcon";
import { TextRegular } from "@/components/TextRegular";

const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Insira um e-mail")
    .email("Insira um e-mail válido"),
  password: z.string().trim().min(6, "A senha deve ter até 6 dígitos"),
});

type SignInSchemaProps = z.infer<typeof signInSchema>;

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useAuth();

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const { control, handleSubmit } = useForm<SignInSchemaProps>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  function togglePasswordVisibility() {
    setShowPassword((prevState) => !prevState);
  }

  function handleCreateAccount() {
    navigation.navigate("signUp");
  }

  async function handleSignIn({ email, password }: SignInSchemaProps) {
    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível fazer login. Tente novamente mais tarde.";

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
      <View className="flex-1 bg-gray-6 pt-10 items-center px-12">
        <Image source={logoImg} className="w-24 h-16 mt-16 mb-5" />
        <Text className="text-gray-1 text-3xl font-karlaBold">marketspace</Text>
        <Text className="text-gray-3 text-sm font-karlaRegular">
          Seu espaço de compra e venda
        </Text>

        <View className="mt-16 gap-4 w-full">
          <Text className="text-gray-2 text-sm text-center font-karlaRegular">
            Acesse sua conta
          </Text>
          <View>
            <FormInput
              control={control}
              name={"email"}
              placeholder={"E-mail"}
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
        </View>

        <View className="mt-8 mb-14 w-full">
          <Button
            type="purple"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          >
            <Button.Text type="light_gray">Enviar pedido</Button.Text>
          </Button>
        </View>

        <View className="w-full gap-4">
          <TextRegular text="Ainda não tem acesso?" className="text-center" />
          <Button type="gray" onPress={handleCreateAccount}>
            <Button.Text type="dark_gray">Criar uma conta</Button.Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
