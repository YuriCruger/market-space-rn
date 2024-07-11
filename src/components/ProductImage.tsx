import { X } from "phosphor-react-native";
import { Image, Pressable, View } from "react-native";

interface ProductImageProps {
  handleRemovePhoto: (productName: string) => void;
  id: string;
  source: { uri: string };
}

export function ProductImage({
  source,
  id,
  handleRemovePhoto,
}: ProductImageProps) {
  return (
    <View className="relative w-[100px] h-[100px] bg-gray-5 items-center justify-center mt-4 rounded-md overflow-hidden">
      <Pressable
        onPress={() => handleRemovePhoto(id)}
        className="absolute right-1 top-1 z-10 bg-gray-2 rounded-full w-4 h-4 items-center justify-center"
      >
        <X size={12} color="#F7F7F8" />
      </Pressable>
      <Image source={source} className="w-full h-full" />
    </View>
  );
}
