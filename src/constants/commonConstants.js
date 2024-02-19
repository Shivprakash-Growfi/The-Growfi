//Common file for all regex related to field validation

// Regex for Amount field
export const AMOUNT_REGEX =
  /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,3})?$/;
