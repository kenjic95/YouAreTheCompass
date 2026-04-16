export const parseCoursePrice = (priceValue) => {
  const numericValue = Number(
    String(priceValue ?? "")
      .replace(/[^0-9.]/g, "")
      .trim()
  );

  return Number.isFinite(numericValue) ? numericValue : 0;
};

export const applyDiscount = (price, discountPercent = 0) => {
  const normalizedPrice = Number(price) || 0;
  const normalizedDiscount = Math.min(
    Math.max(Number(discountPercent) || 0, 0),
    100
  );
  const finalPrice = normalizedPrice * (1 - normalizedDiscount / 100);

  return Number(finalPrice.toFixed(2));
};

export const formatUsdPrice = (amount) =>
  `$${(Number(amount) || 0).toFixed(2)}`;
