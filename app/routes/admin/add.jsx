import { Form, redirect, useNavigation } from "react-router";

import { validatePrice, validateText } from "../../.server/validation";
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from "../../.server/session";
import { addItem } from "../../model/database";

export async function action({ request }) {
  let session = await getSession(request.headers.get("cookie"));
  let formData = await request.formData();
  let name = formData.get("name");
  let category = formData.get("category");
  let price = formData.get("price");
  let quantity = formData.get("quantity");
  let imageurl = formData.get("imageurl");
  let description = formData.get("description");

  let item = {
    name,
    category,
    price: Number(price),
    quantity: Number(quantity),
    imageurl,
    description,
  };

  let fieldErrors = {
    name: validateText(name.trim()),
    category: validateText(category.trim()),
    description:
      description && description.trim()
        ? validateText(description.trim())
        : undefined,
    imageurl:
      imageurl && imageurl.trim() ? validateText(imageurl.trim()) : undefined,
    price: validatePrice(price),
    quantity: quantity < 1 ? "Quantity must be at least 1" : undefined,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors };
  }

  let result = await addItem(item);
  if (result.acknowledged) {
    setSuccessMessage(session, "Item added successfully!");
  } else {
    setErrorMessage(session, "Failed to add item. Please try again.");
  }

  return redirect("/items", {
    headers: {
      "set-cookie": await commitSession(session),
    },
  });
}

const categories = [
  "textbooks",
  "digital devices",
  "stationery",
  "exercise books",
  "Other",
];

export default function Add({ actionData }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Expand your educational marketplace with quality products
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 sm:p-8">
          <Form method="post" className="space-y-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter product name"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 text-sm sm:text-base outline-none transition-all"
              />
              {actionData?.fieldErrors?.name && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {actionData.fieldErrors.name}
                </p>
              )}
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 text-sm sm:text-base outline-none transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              {actionData?.fieldErrors?.category && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {actionData.fieldErrors.category}
                </p>
              )}
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                required
                placeholder="Enter number of items"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 text-sm sm:text-base outline-none transition-all"
              />
              {actionData?.fieldErrors?.quantity && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {actionData.fieldErrors.quantity}
                </p>
              )}
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Price (KSh) *
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 text-sm sm:text-base outline-none transition-all"
              />
              {actionData?.fieldErrors?.price && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {actionData.fieldErrors.price}
                </p>
              )}
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Product Image URL
              </label>
              <input
                type="text"
                name="imageurl"
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 text-sm sm:text-base outline-none transition-all"
              />
              {actionData?.fieldErrors?.imageurl && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {actionData.fieldErrors.imageurl}
                </p>
              )}
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                placeholder="Provide details about the product..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 text-sm sm:text-base outline-none resize-none transition-all"
              />
              {actionData?.fieldErrors?.description && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {actionData.fieldErrors.description}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 dark:focus:ring-indigo-400/25"
              >
                {isSubmitting ? "Submitting..." : "Add Product"}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
