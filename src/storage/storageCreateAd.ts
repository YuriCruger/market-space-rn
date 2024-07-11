import AsyncStorage from "@react-native-async-storage/async-storage";

import { CREATE_AD_STORAGE } from "./storageConfig";

import { AdCreateSchemaType } from "@/screens/AdCreate";

export async function storageCreateAdSave(ad: AdCreateSchemaType) {
  await AsyncStorage.setItem(CREATE_AD_STORAGE, JSON.stringify(ad));
}

export async function storageCreateAdGet() {
  const storage = await AsyncStorage.getItem(CREATE_AD_STORAGE);

  const ad: AdCreateSchemaType = storage ? JSON.parse(storage) : {};

  return ad;
}

export async function storageCreateAdRemove() {
  await AsyncStorage.removeItem(CREATE_AD_STORAGE);
}
