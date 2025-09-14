import { Form, Link, redirect } from "react-router";

import { getSession } from "../../.server/session.js";
import { getOrdersByUser, getUserById } from "../../model/database";

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  let user = await getUserById(userId);
  user._id = user._id.toString();
  let orders = await getOrdersByUser(userId);
  orders = orders.map((order) => ({
    ...order,
    _id: order._id.toString(),
  }));

  return { user, orders };
}

export default function Profile({ loaderData }) {
  let { user, orders } = loaderData;

  return (
    <main className="bg-gradient-to-r from-[#0892d0] to-[#4b0082] text-white min-h-screen p-6 md:p-12 space-y-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center">
        Profile Dashboard
      </h1>

      {/* Profile Details */}
      <ProfileDetails
        key={user._id}
        personId={user._id}
        name={user.username || "Guest"}
        phone={user.phone || "N/A"}
        email={user.email || "N/A"}
        county={user.county || "N/A"}
        town={user.town || "N/A"}
      />

      {/* Orders Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <img
              src="/nav/emptycart.svg"
              alt="No orders made"
              className="w-32 h-32 opacity-50"
            />
            <p className="text-gray-300 text-lg font-semibold">
              NO ORDERS MADE
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {orders.map((order) =>
              order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <OrdersList
                    key={`${order._id}-${item._id}`}
                    title={item.name}
                    orderId={order._id}
                    status={order.status}
                    image={item.imageurl}
                    itemId={item._id}
                  />
                ))
              ) : (
                <p key={order._id} className="text-center text-gray-500">
                  No items in this order.
                </p>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export function ProfileDetails({ name, phone, email, county, town, personId }) {
  return (
    <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Welcome, {name}</h2>
      <h3 className="text-xl font-medium mb-4">Details</h3>
      <article className="space-y-3 text-base md:text-lg">
        <p>
          <span className="font-medium hover:underline">Name: </span>
          {name}
        </p>
        <p>
          <span className="font-medium hover:underline">Phone Number: </span>
          {phone}
        </p>
        <p>
          <span className="font-medium hover:underline">Email Address: </span>
          {email}
        </p>
        <p>
          <span className="font-medium hover:underline">County: </span>
          {county}
        </p>
        <p>
          <span className="font-medium hover:underline">Town: </span>
          {town}
        </p>
      </article>

      <Link to={`/profile/${personId}/edit`}>
        <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition:underline text-white font-medium">
          Edit Details
        </button>
      </Link>
    </section>
  );
}

export function OrdersList({ title, orderId, status, image, itemId }) {
  return (
    <div className="bg-white text-gray-800 rounded-xl shadow-md overflow-hidden md:flex hover:shadow-lg transition flex ">
      {/* Image */}
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-40 md:h-48 object-cover"
        />
      )}

      {/* Order Info */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p>
            <span className="font-medium">Order ID: </span>
            {orderId}
          </p>
          <p>
            <span className="font-medium">Status: </span>
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                status === "pending"
                  ? "bg-yellow-200 text-yellow-800"
                  : status === "completed"
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-200 text-gray-800"
              }`}
            >
              {status}
            </span>
          </p>
        </div>
        <Link to={`/profile/${orderId}/item/${itemId}`}>
          <button className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium">
            See Details
          </button>
        </Link>
      </div>
    </div>
  );
}
