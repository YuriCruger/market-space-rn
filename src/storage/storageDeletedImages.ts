import AsyncStorage from "@react-native-async-storage/async-storage";

import { DELETED_IMAGES_STORAGE } from "./storageConfig";

export async function storageDeletedImagesSave(deletedImages: string[]) {
  await AsyncStorage.setItem(
    DELETED_IMAGES_STORAGE,
    JSON.stringify(deletedImages)
  );
}

export async function storageDeletedImagesGet() {
  const storage = await AsyncStorage.getItem(DELETED_IMAGES_STORAGE);

  const deletedImages: string[] = storage ? JSON.parse(storage) : {};

  return deletedImages;
}

export async function storageDeletedImagesRemove() {
  await AsyncStorage.removeItem(DELETED_IMAGES_STORAGE);
}
