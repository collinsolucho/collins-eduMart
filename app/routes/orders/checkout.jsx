import { data, Form, Link, redirect, useNavigation } from "react-router";
import { ArrowLeft } from "lucide-react";
import { getItem, getUserById, updateUserbyId } from "../../model/database";
import { commitSession, getSession } from "../../.server/session";

// DELIVERY FEE
let DELIVERY_FEE = 200;

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let userId = session.get("userId"); // assume userId stored in session
  let cartItems = session.get("cartItems") || [];

  let results = await getItem();
  let items = results.map((item) => ({ ...item, _id: item._id.toString() }));

  let cartProducts = cartItems
    .map((item) => {
      let matchedProduct = items.find((p) => p._id === item.id);
      return matchedProduct
        ? { ...matchedProduct, quantity: item.quantity }
        : null;
    })
    .filter(Boolean);

  let subtotal = cartProducts.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );

  let user = null;
  if (userId) {
    user = await getUserById(userId);
  }

  return data({
    cartProducts,
    subtotal,
    deliveryFee: DELIVERY_FEE,
    total: subtotal + DELIVERY_FEE,
    user,
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let userId = session.get("userId");

  let formData = await request.formData();
  let _action = formData.get("_action");

  if (_action === "update-user") {
    let updateData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    };
    if (userId) {
      await updateUserbyId(userId, updateData);
    }
    return redirect("/checkout");
  }

  if (_action === "pay") {
    let method = formData.get("method"); // mpesa | airtel | cod
    // Later: integrate M-Pesa Daraja, Airtel API, etc.
    return redirect("/order-confirmation?method=" + method);
  }

  return null;
}

let formatCurrency = (num) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(num);

export default function Checkout({ loaderData }) {
  let { cartProducts, subtotal, deliveryFee, total, user } = loaderData;

  let navigation = useNavigation();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto pt-20 sm:pt-24 lg:pt-32 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Checkout
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Complete your details and choose a payment method.
          </p>
        </div>

        {/* User Details Form */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-200/60 dark:border-gray-700/60 p-6 sm:p-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Personal Details
          </h2>
          <Form method="post" className="grid gap-4">
            <input type="hidden" name="_action" value="update-user" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              defaultValue={user?.username || ""}
              className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              defaultValue={user?.email || ""}
              className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              defaultValue={user?.phone || ""}
              className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Delivery Address"
              defaultValue={user?.town || ""}
              className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
              required
            />

            <button
              type="submit"
              disabled={navigation.state === "submitting"}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {navigation.state === "submitting" ? "Saving..." : "Save Details"}
            </button>
          </Form>
        </div>

        {/* Order Summary */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-200/60 dark:border-gray-700/60 p-6 sm:p-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Order Summary
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-emerald-600 dark:text-emerald-400">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-200/60 dark:border-gray-700/60 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Choose Payment Method
          </h2>
          <Form method="post" className="grid gap-3">
            <input type="hidden" name="_action" value="pay" />
            <button
              type="submit"
              name="method"
              value="mpesa"
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
            >
              Pay with M-Pesa
            </button>
            <button
              type="submit"
              name="method"
              value="airtel"
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition"
            >
              Pay with Airtel Money
            </button>
            <button
              type="submit"
              name="method"
              value="cod"
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition"
            >
              Pay on Delivery
            </button>
          </Form>
        </div>

        {/* Back to Cart */}
        <div className="text-center">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-400 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </Link>
        </div>
      </div>
    </main>
  );
}
