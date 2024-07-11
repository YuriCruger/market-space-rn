import { PaymentMethods } from "@/dtos/ProductDTO";
import { CheckBox } from "@rneui/base";

interface PaymentCheckBoxProps {
  paymentMethods: PaymentMethods[];
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethods[]>>;
  paymentKey: string;
  paymentName: string;
}

export function PaymentCheckBox({
  paymentMethods = [],
  setPaymentMethods,
  paymentKey,
  paymentName,
}: PaymentCheckBoxProps) {
  function handlePaymentChecked() {
    if (paymentMethods.some((payment) => payment.key === paymentKey)) {
      return setPaymentMethods((prevState) =>
        prevState.filter((payment) => payment.key !== paymentKey)
      );
    }
    const newPaymentMethod: PaymentMethods = {
      key: paymentKey,
      name: paymentName,
    };

    setPaymentMethods((prevState) => [...prevState, newPaymentMethod]);
  }

  return (
    <CheckBox
      checked={paymentMethods.some((payment) => payment.key === paymentKey)}
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
      title={paymentName}
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
