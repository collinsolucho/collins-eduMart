import { Link } from "react-router";

export default function OrderConfirmation() {
  return (
    <main className="px-6 max-w-5xl mx-auto mt-36 text-center">
      <h1 className="text-4xl font-bold mb-4 text-green-600">
        Order Confirmed!
      </h1>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <p className="text-gray-600 mb-6">
        You will receive an email confirmation shortly.
      </p>
      <Link
        to="/profile/order"
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 mr-4"
      >
        View My Orders
      </Link>
      <Link
        to="/products"
        className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700"
      >
        Continue Shopping
      </Link>
    </main>
  );
}
