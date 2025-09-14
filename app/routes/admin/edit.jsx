import { getItem, removeItem, updateItem } from "../../model/database";
import {
  getSession,
  commitSession,
  setErrorMessage,
  setSuccessMessage,
} from "../../.server/session";
import { Form, redirect, useNavigation } from "react-router";

export async function loader({ params }) {
  let productId = params.id;
  let items = await getItem();
  let product = items.find((item) => item._id.toString() === productId);

  return {
    ...product,
    _id: product._id.toString(), // Ensure _id is a string
  };
}

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let update = formData.get("update");
  let id = formData.get("_id");

  switch (update) {
    case "update": {
      let updateData = {
        name: formData.get("name"),
        category: formData.get("category"),
        description: formData.get("description"),
        imageurl: formData.get("imageurl"),
        price: parseFloat(formData.get("price")),
        total: parseInt(formData.get("total"), 10),
      };

      let result = await updateItem(id, updateData);
      if (result.acknowledged) {
        setSuccessMessage(session, "Product updated successfully!");
      } else {
        setErrorMessage(session, "Failed to update product. Please try again.");
      }

      return redirect("/items", {
        headers: {
          "set-cookie": await commitSession(session),
        },
      });
    }

    case "delete": {
      let result = await removeItem(id);
      if (result.acknowledged) {
        setSuccessMessage(session, "Item deleted successfully!");
      } else {
        setErrorMessage(session, "Failed to delete item. Please try again.");
      }

      return redirect("/items", {
        headers: {
          "set-cookie": await commitSession(session),
        },
      });
    }
  }
}

export default function EditProductForm({ loaderData }) {
  let navigation = useNavigation();
  let isSubmitting = navigation.state !== "idle";

  // Predefined categories
  let categories = [
    "textbooks",
    "digital devices",
    "stationery",
    "exercise books",
    "Other",
  ];

  return (
    <main className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-all duration-500">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Edit Product
        </h1>

        <Form method="post" className="flex flex-col gap-4">
          <input type="hidden" name="_id" value={loaderData._id} />

          <label className="flex flex-col gap-1 text-sm sm:text-base">
            Name:
            <input
              type="text"
              required
              name="name"
              defaultValue={loaderData.name}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm sm:text-base">
            Category:
            <select
              name="category"
              defaultValue={loaderData.category}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm sm:text-base">
            Description:
            <textarea
              name="description"
              rows="4"
              placeholder="Provide detailed information about the product, its features, and educational benefits"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 transition-all duration-200 outline-none resize-none text-sm sm:text-base"
              defaultValue={loaderData.description}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm sm:text-base">
            Price:
            <input
              required
              type="number"
              step="0.01"
              name="price"
              defaultValue={loaderData.price}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm sm:text-base">
            Total:
            <input
              required
              type="number"
              name="total"
              defaultValue={loaderData.total || 1}
              min={0}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm sm:text-base">
            Image URL:
            <input
              type="text"
              required
              name="imageurl"
              defaultValue={loaderData.imageurl}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition"
            />
          </label>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              type="submit"
              name="update"
              value="update"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
              disabled={
                isSubmitting && navigation.formData?.get("update") === "update"
              }
            >
              {isSubmitting &&
              navigation.formData?.get("update") === "update" ? (
                <>
                  <span className="spinner border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>

            <button
              type="submit"
              name="update"
              value="delete"
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition"
              disabled={
                isSubmitting && navigation.formData?.get("update") === "delete"
              }
            >
              {isSubmitting && navigation.formData?.get("update") === "delete"
                ? "Deleting..."
                : "Delete"}{" "}
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}
