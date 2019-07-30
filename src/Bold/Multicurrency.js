function removeCurrencyCode(moneyFormats) {
  Object.keys(moneyFormats).forEach(function(currencyCode) {
    moneyFormats[currencyCode].money_with_currency_format =
      moneyFormats[currencyCode].money_format;
  });
  return moneyFormats;
}
export default { removeCurrencyCode };
