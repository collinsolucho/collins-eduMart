import { data, Form, Link } from "react-router";
import { commitSession, getSession } from "../.server/session";
import { getItem } from "../model/database";
import { Card } from "../components/featured";

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
                <Card
                  id={item._id}
                  title={item.name}
                  description={item.category}
                  price={item.price}
                  image={item.imageurl}
                  reviews={0}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
