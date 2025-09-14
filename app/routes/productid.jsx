import { Link, useNavigation } from "react-router";

import { ShoppingBag } from "lucide-react";
import { getItemById, getItem } from "../model/database";

export async function loader({ params }) {
  let item = await getItemById(params.id);
  if (!item) throw new Response("Not Found", { status: 404 });

  // Fetch related products with the same category
  let allItems = await getItem();
  let relatedProducts = allItems.filter(
    (prod) =>
      prod.category === item.category &&
      prod._id.toString() !== item._id.toString()
  );

  return {
    ...item,
    _id: item._id.toString(),
    relatedProducts,
  };
}

export default function ProductDetails({ loaderData }) {
  const navigation = useNavigation();
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8 sm:px-6 lg:px-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6 text-gray-600 dark:text-gray-400">
          <Link
            to="/products"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {loaderData.name}
          </span>
        </nav>

        {/* Product Card */}
        <section className="group flex flex-col lg:flex-row bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all duration-500 hover:scale-[1.01]">
          {/* Image Section */}
          <div className="relative lg:w-1/2 xl:w-2/5 overflow-hidden">
            <img
              src={loaderData.imageurl}
              alt={loaderData.name}
              className="w-full h-72 lg:h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Category Badge */}
              <span className="inline-block text-sm px-4 py-2 rounded-full font-medium bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50">
                {loaderData.category}
              </span>

              {/* Product Name */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                {loaderData.name}
              </h1>

              {/* Divider */}
              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {loaderData.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                  KSH {loaderData.price}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    KSH
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Per item
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-8 border-t border-gray-200/60 dark:border-gray-700/60">
              <Link to="/cart">
                <button className="w-full inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 dark:from-blue-500 dark:via-blue-600 dark:to-indigo-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/25 dark:focus:ring-blue-400/25">
                  <ShoppingBag className="mr-2" />
                  Add to Cart
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {loaderData.relatedProducts &&
          loaderData.relatedProducts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-indigo-700">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {loaderData.relatedProducts.map((product) => (
                  <Link
                    key={product._id.toString()}
                    to={`/products/${product._id.toString()}`}
                    className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <img
                      src={product.imageurl || "/home/default.jpg"}
                      alt={`Cover of ${product.name}`}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Grade: {product.category || "All Grades"}
                      </p>
                      <p className="text-indigo-600 font-bold text-lg">
                        Ksh {product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
      </div>
    </main>
  );
}
