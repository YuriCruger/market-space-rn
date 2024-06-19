import { CheckBox } from "@rneui/base";

interface PaymentCheckBoxProps {
  paymentMethods: string[];
  setPaymentMethods: React.Dispatch<React.SetStateAction<string[]>>;
  value: string;
  label: string;
}

export function PaymentCheckBox({
  paymentMethods,
  setPaymentMethods,
  value,
  label,
}: PaymentCheckBoxProps) {
  function handlePaymentChecked() {
    if (paymentMethods.includes(value)) {
      return setPaymentMethods((prevState) =>
        prevState.filter((payment) => payment !== value)
      );
    }
    setPaymentMethods((prevState) => [...prevState, value]);
  }

  return (
    <CheckBox
      checked={paymentMethods.includes(value)}
      onPress={handlePaymentChecked}
      containerStyle={{
        backgroundColor: undefined,
        marginRight: "auto",
      }}
      iconType="material-community"
      checkedIcon="checkbox-marked"
      uncheckedIcon="checkbox-blank-outline"
      checkedColor="#647AC7"
      size={24}
      title={label}
      titleProps={{
        style: {
          fontSize: 16,
          color: "#3E3A40",
          fontFamily: "Karla_400Regular",
        },
      }}
    />
  );
}
