export const priceFormat = (price: number) => {
 return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 2,
    style: "currency",
    currency: "USD",
  }).format(price);
};
