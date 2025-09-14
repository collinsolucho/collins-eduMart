import { Link, redirect } from "react-router";
import { addOrder } from "../../model/database";
import { getSession } from "../../.server/session";

export async function loader({ request }) {
  // You can add loader logic here if needed, e.g. fetch cart or user info
  return null;
}

export async function action({ request }) {
  let session = await getSession(request.headers.get("cookie"));
  let userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  let formData = await request.formData();
  let orderData = {
    userId,
    items: JSON.parse(formData.get("items") || "[]"),
    total: parseFloat(formData.get("total") || "0"),
    paymentMethod: formData.get("paymentMethod") || "unknown",
    status: "pending",
    createdAt: new Date(),
  };

  await addOrder(orderData);

  // Redirect to order confirmation or thank you page
  return redirect("/orders/confirmation");
}

export default function Checkout() {
  return (
    <main className="px-6 max-w-5xl mx-auto mt-36">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <p className="text-gray-600 mb-6">
        Order summary and payment will go here.
      </p>
      <form method="post">
        {/* Include hidden inputs or UI for order details */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Proceed to Payment
        </button>
      </form>
      <Link to="/cart" className="text-blue-600 hover:underline mt-4 block">
        Back to cart
      </Link>
    </main>
  );
}
