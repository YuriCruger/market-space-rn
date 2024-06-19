import { FileDTO } from "@/dtos/FileDTO";
import { X } from "phosphor-react-native";
import { Image, Pressable, View } from "react-native";

interface ProductImageProps {
  productPhoto: FileDTO;
  handleRemovePhoto: (productName: string) => void;
}

export function ProductImage({
  productPhoto,
  handleRemovePhoto,
}: ProductImageProps) {
  return (
    <View className="relative w-[100px] h-[100px] bg-gray-5 items-center justify-center mt-4 rounded-md overflow-hidden">
      <Pressable
        onPress={() => handleRemovePhoto(productPhoto.name)}
        className="absolute right-1 top-1 z-10 bg-gray-2 rounded-full w-4 h-4 items-center justify-center"
      >
        <X size={12} color="#F7F7F8" />
      </Pressable>
      <Image source={productPhoto} className="w-full h-full" />
    </View>
  );
}
