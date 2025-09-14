import { data, Link } from "react-router";
import { getItem } from "../../model/database";
import { commitSession, getSession } from "../../.server/session";
import { redirect, useLoaderData } from "react-router";

// ---------------- Loader ----------------
export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  const products = await getItem();

  return data(
    { products },
    { headers: { "set-cookie": await commitSession(session) } }
  );
}

// ---------------- Products Page ----------------
export default function Products() {
  const { products } = useLoaderData();

  return (
    <main className="p-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          name={product.name}
          category={product.category}
          price={product.price}
          description={product.description}
          imageurl={product.imageurl}
          _id={product._id}
        />
      ))}
    </main>
  );
}

// ---------------- Product Card ----------------
export function ProductCard({
  name,
  category,
  price,
  description,
  imageurl,
  _id,
}) {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-md hover:shadow-lg overflow-hidden transition duration-300">
      {/* Product Image */}
      <img src={imageurl} alt={name} className="w-full h-48 object-cover" />

      {/* Product Info */}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-sm text-gray-500">{category}</p>
        <p className="text-gray-700 font-medium">ksh {price}</p>
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>

        {/* Action Button */}
        <Link
          to={`/products/${_id}/edit`}
          className="mt-2 text-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
        >
          Edit Product
        </Link>
      </div>
    </div>
  );
}
