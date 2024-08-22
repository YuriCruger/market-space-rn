import { ReactNode } from "react";
import { Pressable } from "react-native";
import Toast from "react-native-toast-message";

import { MAX_IMAGE_SIZE_MB } from "@/utils/MaxImageSize";
import { FileDTO } from "@/dtos/FileDTO";

import * as CryptoJS from "crypto-js";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

interface ImagePickerComponentProps {
  onImagePick: (photoFile: FileDTO) => void;
  children: ReactNode;
}

export function ImagePickerComponent({
  onImagePick,
  children,
}: ImagePickerComponentProps) {
  function isImageTooLarge(photoSize: number): boolean {
    const sizeInMB = photoSize / 1024 / 1024;
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
      };

      onImagePick(photoFile);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao selecionar a foto. Tente novamente mais tarde.",
        text1Style: { fontSize: 16 },
      });
    }
  }

  return <Pressable onPress={handlePhotoSelected}>{children}</Pressable>;
}
