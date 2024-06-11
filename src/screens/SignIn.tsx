import { Image, ScrollView, Text, View } from "react-native";
import logoImg from "@/assets/logo.png";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { PasswordIcon } from "@/components/PasswordIcon";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@/routes/auth.routes";
import { AuthPrompt } from "@/components/AuthPrompt";

export function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function togglePasswordVisibility() {
    setShowPassword((prevState) => !prevState);
  }

  function handleCreateAccount() {
    navigation.navigate("signUp");
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
          <Input placeholder="E-mail" />
          <PasswordIcon
            isVisible={showPassword}
            toggleVisibility={togglePasswordVisibility}
          >
            <Input secureTextEntry={!showPassword} placeholder="Senha" />
          </PasswordIcon>
        </View>

        <View className="mt-8 mb-14 w-full">
          <Button type="purple">
            <Button.Text type="light_gray">Enviar pedido</Button.Text>
          </Button>
        </View>

        <View className="w-full gap-4">
          <AuthPrompt title="Ainda não tem acesso?" />
          <Button type="gray" onPress={handleCreateAccount}>
            <Button.Text type="dark_gray">Criar uma conta</Button.Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
