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
  { key: "boleto", name: "Boleto" },
  { key: "pix", name: "Pix" },
  { key: "cash", name: "Dinheiro" },
  { key: "card", name: "Cartão de crédito" },
  { key: "deposit", name: "Cartão de débito" },
];
