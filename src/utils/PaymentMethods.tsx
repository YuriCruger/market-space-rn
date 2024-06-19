import {
  Bank,
  Barcode,
  CreditCard,
  Money,
  QrCode,
} from "phosphor-react-native";

export const PAYMENT_ICON = {
  boleto: <Barcode size={18} />,
  pix: <QrCode size={18} />,
  cash: <Money size={18} />,
  card: <CreditCard size={18} />,
  deposit: <Bank size={18} />,
};

export const paymentOptions = [
  { value: "boleto", label: "Boleto" },
  { value: "pix", label: "Pix" },
  { value: "cash", label: "Dinheiro" },
  { value: "card", label: "Cartão de crédito" },
  { value: "deposit", label: "Cartão de débito" },
];
