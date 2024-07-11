import AsyncStorage from "@react-native-async-storage/async-storage";

import { EDIT_AD_STORAGE } from "./storageConfig";

import { AdEditSchemaType } from "@/screens/AdEdit";

export async function storageEditAdSave(ad: AdEditSchemaType) {
  await AsyncStorage.setItem(EDIT_AD_STORAGE, JSON.stringify(ad));
}

export async function storageEditAdGet() {
  const storage = await AsyncStorage.getItem(EDIT_AD_STORAGE);

  const ad: AdEditSchemaType = storage ? JSON.parse(storage) : {};

  return ad;
}

export async function storageEditAdRemove() {
  await AsyncStorage.removeItem(EDIT_AD_STORAGE);
}
