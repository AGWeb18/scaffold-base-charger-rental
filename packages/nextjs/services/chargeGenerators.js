// Updated chargeGenerator.js to accept dynamic values

const createCharge = async ({
  amount,
  currency = "CAD",
  name,
  description,
  redirect_url,
  customerId,
  email,
  address,
}) => {
  const url = "https://api.commerce.coinbase.com/charges";

  const requestBody = {
    local_price: {
      amount, // Dynamic amount
      currency, // Default to 'USD', but can be overridden
    },
    pricing_type: "fixed_price",
    name: name || "Elektris Booking Charger", // Default name if not provided
    description: description || "Charge for services rendered",
    redirect_url: redirect_url || "https://your-default-redirect.com", // Default redirect if not provided
    metadata: {
      // Optional charge metadata, ensure these are valid or omit if unnecessary
      id: customerId,
      email,
      address,
    },
  };

  const payload = {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CC-Api-Key": process.env.COMMERCE_API_KEY, // Ensure this is securely handled
    },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(url, payload);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating charge:", error);
    throw error; // It's often better to throw the error to handle it further up the call stack
  }
};

export { createCharge };
