import AsyncStorage from "@react-native-async-storage/async-storage";
import { AD_STORAGE } from "./storageConfig";
import { CreateAdSchemaType } from "@/screens/CreateAd";

export async function storageAdSave(ad: CreateAdSchemaType) {
  await AsyncStorage.setItem(AD_STORAGE, JSON.stringify(ad));
}

export async function storageAdGet() {
  const storage = await AsyncStorage.getItem(AD_STORAGE);

  const ad: CreateAdSchemaType = storage ? JSON.parse(storage) : {};

  return ad;
}

export async function storageAdRemove() {
  await AsyncStorage.removeItem(AD_STORAGE);
}
