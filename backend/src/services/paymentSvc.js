// paymentSvc.js
async function charge(amount, paymentMethod) {
  if (!amount || amount <= 0) {
    throw new Error("Invalid payment amount");
  }
  if (!paymentMethod || !paymentMethod.token) {
    throw new Error("Invalid payment method");
  }

  await new Promise((resolve) => setTimeout(resolve, 50));

  return {
    status: "success",
    transactionId: `txn_${Date.now()}`,
    amount
  };
}

module.exports = {
  charge
};
