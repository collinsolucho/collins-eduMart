import { data, Form, Link, redirect, useNavigation } from "react-router";
import { commitSession, getSession } from "../.server/session.js";
import { getItem } from "../model/database";
import { EmptyCart } from "../components/Icon";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));

  // Check if user is logged in
  if (!session.get("userId")) {
    return redirect("/login");
  }

  let cartItems = session.get("cartItems") || [];
  let results = await getItem(); //fetch items from database done on every route
  let items = results.map((item) => {
    return {
      ...item,
      _id: item._id.toString(),
    };
  });
  //For every item in the cart, it finds the matching items data from the full dessert list.
  let cartProducts = cartItems
    .map((item) => {
      let matchedProduct = items.find(
        (items) => items._id === item.id
        //use_id from items since we converted it to string
      );

      //Adds the quantity from the cart to the matched dessert and returns it.
      let matchedProductWithQuantity = {
        ...matchedProduct,
        quantity: item.quantity,
      };
      return matchedProductWithQuantity;
    })
    .filter(Boolean);

  return { cartProducts, items };
}

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));

  if (!session.get("userId")) {
    return redirect("/login");
  }

  let formData = await request.formData();

  let id = formData.get("id");
  let action = formData.get("_action");

  let cartItems = session.get("cartItems") || [];

  switch (action) {
    case "alter-quantity": {
      let quantity = formData.get("quantity");

      if (Number(quantity) <= 0) {
        // Remove item from cart if quantity is 0 or negative
        let index = cartItems.findIndex((item) => item.id === id);
        if (index !== -1) {
          cartItems.splice(index, 1);
          session.set("cartItems", cartItems);
        }
        return data(
          { ok: true },
          {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          }
        );
      } // prevents negative values & 0

      // Get the element from cartItems that matches the id
      let matchedItem = cartItems.find((item) => item.id === id);
      // console.log({ matchedItem });

      if (matchedItem) {
        // Update the element's quantity
        matchedItem.quantity = Number(quantity);

        let matchedItemIndex = cartItems.findIndex((item) => item.id === id); //Replaces the old item with the updated one using .splice().

        cartItems.splice(matchedItemIndex, 1, matchedItem);
        //start at matcheditem,remove 1,insert new
      }

      session.set("cartItems", cartItems);

      return data(
        { ok: true },
        {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        }
      );
    }
    case "delete": {
      //   Get the index of the item from cartItems that matches the id
      let index = cartItems.findIndex((item) => item.id === id);

      //   Delete the item that matches the index
      if (index !== -1) {
        cartItems.splice(index, 1);
        session.set("cartItems", cartItems);
      }
      // Finds the item by ID and removes it from the cart using .splice(index, 1).
      break;
    }
  }

  return data(
    { ok: true },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

let formatCurrency = (num) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(num);

export default function ({ loaderData }) {
  const navigation = useNavigation();
  // console.log(loaderData);
  let { cartProducts, items } = loaderData;
  // console.log({ items });
  // ✅ Compute subtotal here in the UI
  let subtotal = cartProducts.reduce(
    (acc, item) => acc + (item?.price || 0) * (item?.quantity || 0),
    0
  );
  //prevents breakage if item in cartProducts doesn't have price/quantity

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto pt-20 sm:pt-24 lg:pt-32">
        {/* Page Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
            {cartProducts.length === 0
              ? "Your cart is waiting for some amazing educational products!"
              : `${cartProducts.length} item${cartProducts.length > 1 ? "s" : ""} in your cart`}
          </p>
        </div>

        {cartProducts.length === 0 ? (
          // Empty cart state with enhanced styling
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20">
            <div className="w-48 sm:w-60 lg:w-72 mb-8 opacity-80">
              <EmptyCart />
            </div>
            <div className="text-center mb-8 max-w-md">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Discover our collection of textbooks, stationery, learning
                games, and educational gadgets to enhance your learning journey.
              </p>
            </div>
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/25"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          // Cart with items
          <div className="space-y-6">
            {/* Cart Items List */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200/60 dark:border-gray-700/60">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Cart Items
                </h2>
              </div>
              <ul className="divide-y divide-gray-200/60 dark:divide-gray-700/60">
                {cartProducts.map((item) => (
                  <li key={item._id} className="p-4 sm:p-6">
                    <CartItems
                      name={item.name}
                      imageurl={item.imageurl}
                      price={item.price}
                      id={item._id}
                      quantity={item.quantity}
                      navigation={navigation}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Cart Summary */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 dark:border-gray-700/60 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order Summary
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                      {formatCurrency(subtotal)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Subtotal
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Shipping and taxes calculated at checkout
                  </p>
                </div>

                <Link
                  to="/checkout"
                  className={`group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 min-w-fit ${
                    navigation.state === "submitting" ||
                    navigation.state === "loading"
                      ? "bg-gray-400 cursor-not-allowed ring-gray-400"
                      : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 dark:from-emerald-500 dark:to-green-500 dark:hover:from-emerald-600 dark:hover:to-green-600 focus:ring-emerald-500/25"
                  }`}
                  aria-disabled={
                    navigation.state === "submitting" ||
                    navigation.state === "loading"
                  }
                >
                  {navigation.state === "submitting" ||
                  navigation.state === "loading"
                    ? "Processing..."
                    : "Proceed to Checkout"}
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export function CartItems({ name, imageurl, price, id, quantity, navigation }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <div className="w-full sm:w-24 lg:w-32 aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-md">
          <img
            src={imageurl}
            alt={`Product image for ${name}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 space-y-3">
        {/* Product Name */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white leading-tight">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(price)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            per item
          </span>
        </div>

        {/* Mobile: Quantity and Total on separate rows */}
        <div className="flex flex-col sm:hidden space-y-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantity:
            </span>
            <Form className="flex items-center gap-2" method="post">
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="_action" value="alter-quantity" />
              <button
                name="quantity"
                type="submit"
                value={Number(quantity) - 1}
                disabled={navigation.state === "submitting"}
                className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white" />
              </button>
              <span className="min-w-[2rem] text-center font-semibold text-gray-900 dark:text-white">
                {quantity}
              </span>
              <button
                name="quantity"
                type="submit"
                value={Number(quantity) + 1}
                disabled={navigation.state === "submitting"}
                className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white" />
              </button>
            </Form>
          </div>

          {/* Total Price */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total:
            </span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(price * quantity)}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop: Quantity and Actions */}
      <div className="hidden sm:flex sm:flex-col sm:items-end sm:justify-between sm:gap-4 sm:min-w-[200px]">
        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Qty:
          </span>
          <Form className="flex items-center gap-2" method="post">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="_action" value="alter-quantity" />
            <button
              name="quantity"
              type="submit"
              value={Number(quantity) - 1}
              className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            >
              <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white" />
            </button>
            <span className="min-w-[2rem] text-center font-semibold text-gray-900 dark:text-white">
              {quantity}
            </span>
            <button
              name="quantity"
              type="submit"
              value={Number(quantity) + 1}
              className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            >
              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white" />
            </button>
          </Form>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {formatCurrency(price)} × {quantity}
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(price * quantity)}
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <div className="flex sm:flex-col sm:justify-start">
        <Form method="post" className="ml-auto sm:ml-0">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="_action" value="delete" />
          <button
            type="submit"
            disabled={navigation.state === "submitting"}
            className="group flex items-center justify-center w-10 h-10 rounded-lg text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove item from cart"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          </button>
        </Form>
      </div>
    </div>
  );
}
