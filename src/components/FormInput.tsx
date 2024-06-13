import React from "react";
import { Controller } from "react-hook-form";
import { InputErrorMessage } from "./InputErrorMessage";
import { Input } from "./Input";

interface FormInputProps {
  control: any;
  name: string;
  placeholder: string;
  isPassword?: boolean;
}

export function FormInput({
  control,
  name,
  placeholder,
  isPassword,
}: FormInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <Input
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={isPassword}
          />
          {error?.message && <InputErrorMessage message={error.message} />}
        </>
      )}
    />
  );
}
