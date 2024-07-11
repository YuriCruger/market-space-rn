export function ConvertPriceToInt(price: string): number {
  return parseInt(price.replace(/\./g, "").replace(",", ""), 10);
}
