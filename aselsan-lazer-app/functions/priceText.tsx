import { MainStore } from "../stores/MainStore";

export function priceText(
  price: any,
  currency: string = getCurrency(),
  fixed: number = 2
) {
  return parseFloat(price).toFixed(fixed).toString() + " " + currency;
}

export function getCurrency() {
  return "TL";
}
