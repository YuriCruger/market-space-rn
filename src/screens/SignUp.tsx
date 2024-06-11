import { Image, ScrollView, Text, View } from "react-native";
import logoImg from "@/assets/logo.png";
import avatarImg from "@/assets/avatar.png";
import { PencilSimpleLine } from "phosphor-react-native";
import { Input } from "@/components/Input";
import { PasswordIcon } from "@/components/PasswordIcon";
import { useState } from "react";
import { Button } from "@/components/Button";
import { AuthPrompt } from "@/components/AuthPrompt";

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function togglePasswordVisibility() {
    setShowPassword((prevState) => !prevState);
  }

  function toggleConfirmPasswordVisibility() {
    setShowConfirmPassword((prevState) => !prevState);
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
          <Image source={avatarImg} className="w-[88px] h-[88px]" />
          <View className="absolute left-[55%] bottom-0 bg-blue-light rounded-full h-10 w-10 items-center justify-center ">
            <PencilSimpleLine size={16} color="white" />
          </View>
        </View>

        <View className="gap-4">
          <Input placeholder="Nome" />
          <Input placeholder="E-mail" />
          <Input placeholder="Telefone" />
          <PasswordIcon
            isVisible={showPassword}
            toggleVisibility={togglePasswordVisibility}
          >
            <Input placeholder="Senha" />
          </PasswordIcon>

          <PasswordIcon
            isVisible={showConfirmPassword}
            toggleVisibility={toggleConfirmPasswordVisibility}
          >
            <Input placeholder="Confirmar senha" />
          </PasswordIcon>
        </View>

        <View className="mt-6">
          <Button type="black">
            <Button.Text type="light_gray">Criar</Button.Text>
          </Button>
        </View>

        <View className="mt-12 gap-4">
          <AuthPrompt title="Já tem uma conta?" />
          <Button type="gray">
            <Button.Text type="dark_gray">Ir para o login</Button.Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
