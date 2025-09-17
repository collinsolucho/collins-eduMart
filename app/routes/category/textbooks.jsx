import { data } from "react-router";
import { getItemsByCategory } from "../../model/database";
import { commitSession, getSession } from "../../.server/session";

import { Card } from "../../components/featured";

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let userId = session.get("userId");

  let items = await getItemsByCategory("textbooks");
  return data(
    { items },
    {
      headers: {
        "set-cookie": await commitSession(session),
      },
    }
  );
}

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));

  let formData = await request.formData();
  let id = formData.get("id");
  let cartItem = { id, quantity: 1 };

  let cartItems = session.get("cartItems") || [];
  let matchedItem = cartItems.find((item) => item.id === id);
  if (matchedItem) {
    return data({ ok: false, message: "item already in cart" });
  } else {
    cartItems.push(cartItem);
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

export default function Textbooks({ loaderData }) {
  let { items } = loaderData;
  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-10 text-center">
          Textbooks
        </h1>
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-8 mt-16 text-center">
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
              No items for now come back later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card
                key={item._id}
                image={item.imageurl}
                title={item.name}
                description={item.category}
                price={item.price}
                id={item._id}
                reviews={0}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
