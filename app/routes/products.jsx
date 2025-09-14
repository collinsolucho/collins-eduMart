import { data, Form, Link } from "react-router";
import { commitSession, getSession } from "../.server/session";
import { getItem } from "../model/database";

//data from db
export async function loader({ request }) {
  let url = new URL(request.url);
  let q = url.searchParams.get("q") || ""; //  read from ?q=

  let results = await getItem();

  // convert _id to string and filter by search term
  let items = results
    .map((item) => ({ ...item, _id: item._id.toString() }))
    .filter((item) => item.name.toLowerCase().includes(q.toLowerCase()));

  return { items, q }; //  also return q so UI can show it
}

//setting cookies
export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let id = formData.get("id");

  //construct cart item object
  let cartItem = { id, quantity: 1 };

  //add items to cartitems if absent return empty array
  let cartItems = session.get("cartItems") || [];
  let matchedItem = cartItems.find((item) => item.id === id);
  if (matchedItem) {
    return data({ ok: false, message: "Item already in cart" });
  } else {
    cartItems.push(cartItem);
  }
  //adding and commiting session
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

export default function List({ loaderData }) {
  let { items, q } = loaderData;
  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-10 text-center">
          Our Products {q && `(search: ${q})`}
        </h1>
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-8 mt-16 text-center">
            <div className="w-60 text-gray-400 dark:text-gray-500">
              {/* Replace with your actual EmptyCart SVG component */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-24 h-24 mx-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.344 1.087-.835l1.823-6.841a.75.75 0 00-.543-.922l-13.5-3.411a.75.75 0 00-.915.646L4.5 12.75z"
                />
              </svg>
            </div>
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
              Your product list is empty.
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Check back later for new and exciting courses!
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
              <li key={item._id}>
                <Products
                  itemId={item._id}
                  name={item.name}
                  category={item.category}
                  price={item.price}
                  imageurl={item.imageurl}
                  id={item._id}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function Products({ name, category, price, imageurl, id, itemId }) {
  return (
    <article className="group relative flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Link
          key={itemId}
          to={`/products/${itemId}`}
          className="block w-full h-full"
        >
          <img
            src={imageurl}
            alt={`Product image for ${name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </Link>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">
          {category}
        </p>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight flex-grow">
          <Link
            key={itemId}
            to={`/products/${itemId}`}
            className="hover:underline"
          >
            {name}
          </Link>
        </h2>
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
            ksh {price}
          </p>
          <Form method="post">
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-200"
            >
              + Add to Cart
            </button>
          </Form>
        </div>
      </div>
    </article>
  );
}
