/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";

// import { loadStripe } from "@stripe/stripe-js";

// Adjust the import path as necessary
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Props interface
interface CheckoutComponentProps {
  totalCost: string;
  chargerId: string; // Adjust types as necessary
  userId: string; // Assuming string, adjust if it's a number or another type
  numHours: number;
  bookingDate: string; // Assuming ISO string format
}

const CheckoutComponent: React.FC<CheckoutComponentProps> = ({
  totalCost,
  chargerId,
  userId,
  numHours,
  bookingDate,
}) => {
  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log("Order canceled -- continue to shop around and checkout when youre ready.");
    }
  }, []);

  return (
    <form action="/api/checkout_sessions" method="POST">
      <input type="hidden" name="totalCost" value={totalCost} />
      <input type="hidden" name="chargerId" value={chargerId} />
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="numHours" value={numHours.toString()} />
      <input type="hidden" name="bookingDate" value={bookingDate} />

      <section>
        <button type="submit" role="link">
          Checkout
        </button>
      </section>
      <style jsx>
        {`
          section {
            background: #ffffff;
            display: flex;
            flex-direction: column;
            width: 400px;
            height: 112px;
            border-radius: 6px;
            justify-content: space-between;
          }
          button {
            height: 36px;
            background: #556cd6;
            border-radius: 4px;
            color: white;
            border: 0;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
          }
          button:hover {
            opacity: 0.8;
          }
        `}
      </style>
    </form>
  );
};

export default CheckoutComponent;
