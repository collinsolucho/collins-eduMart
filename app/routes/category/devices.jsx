import { Plus } from "lucide-react";
import { data, Form, redirect } from "react-router";
import { findDevices } from "../../model/database";
import { commitSession, getSession } from "../../.server/session";
import { Link } from "react-router";

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }
  let items = await findDevices();
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
  if (!session.get("userId")) {
    return redirect("/login");
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

export default function Devices({ loaderData }) {
  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {loaderData.items.map((item) => (
        <Card
          key={item._id}
          img={item.imageurl}
          title={item.name}
          category={item.category}
          price={item.price}
          description={item.description}
          id={item._id}
        />
      ))}
    </main>
  );
}

export function Card({ img, title, category, price, id }) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <Link to={`/products/${id}`} className="block h-48 overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold mb-1">{title}</h2>
        <p className="text-sm text-gray-600 mb-2">{category}</p>
        <p className="text-indigo-600 font-bold mb-4">Ksh {price}</p>
        <Form method="post" className="mt-4">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-200"
          >
            <Plus /> Add to Cart
          </button>
        </Form>
      </div>
    </article>
  );
}
