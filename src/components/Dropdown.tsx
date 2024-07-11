import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface DropdownComponentProps {
  data: { label: string; value: string }[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export const DropdownComponent = ({
  data,
  value,
  setValue,
}: DropdownComponentProps) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "#364D9D" }]}
        selectedTextStyle={styles.textStyle}
        itemTextStyle={styles.textStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={""}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 34,
    width: 132,
    borderColor: "#5F5B62",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 12,
  },

  textStyle: {
    fontSize: 14,
    fontFamily: "Karla_400Regular",
    color: "#1A181B",
  },
});
