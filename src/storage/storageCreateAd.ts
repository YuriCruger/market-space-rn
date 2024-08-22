import AsyncStorage from "@react-native-async-storage/async-storage";

import { CREATE_AD_STORAGE } from "./storageConfig";

import { AdCreateSchemaType } from "@/screens/AdCreate";

export async function saveStorageAd(ad: AdCreateSchemaType) {
  await AsyncStorage.setItem(CREATE_AD_STORAGE, JSON.stringify(ad));
}

export async function getStorageAd() {
  const storedAdJson = await AsyncStorage.getItem(CREATE_AD_STORAGE);

  const ad: AdCreateSchemaType = storedAdJson ? JSON.parse(storedAdJson) : {};

  return ad;
}

export async function removeStorageAd() {
  await AsyncStorage.removeItem(CREATE_AD_STORAGE);
}
