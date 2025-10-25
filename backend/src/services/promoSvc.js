// promoSvc.js
const { badRequest } = require("../utils/apiError");

const PROMO_CODES = {
  SAVE10: { type: "percentage", value: 10 },
  WELCOME5: { type: "fixed", value: 5 }
};

async function applyPromo(code, cartTotal) {
  if (!code) {
    throw badRequest("Promo code required");
  }
  const promo = PROMO_CODES[code.toUpperCase()];
  if (!promo) {
    throw badRequest("Invalid promo code");
  }

  let discount = 0;
  if (promo.type === "percentage") {
    discount = (cartTotal * promo.value) / 100;
  } else if (promo.type === "fixed") {
    discount = promo.value;
  }

  const newTotal = Math.max(cartTotal - discount, 0);

  return {
    code: code.toUpperCase(),
    discount,
    total: newTotal
  };
}

module.exports = {
  applyPromo
};
