import { getOrders, updateOrderStatus } from "../../model/database";
import { commitSession, getSession } from "../../.server/session";
import { data, Form, redirect, useLoaderData } from "react-router";

// ----------------- Loader -----------------
export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  let orders = await getOrders();

  return data(
    { orders },
    { headers: { "set-cookie": await commitSession(session) } }
  );
}
export async function action({ request }) {
  let formData = await request.formData();
  let orderId = formData.get("orderId"); // hidden input from the form

  if (!orderId) {
    throw new Error("Order ID missing");
  }

  await updateOrderStatus(orderId, "completed");
  // redirect back to orders page
  return redirect("/orders", {
    headers: {
      "set-cookie": await commitSession(session),
    },
  });
}
// ----------------- Orders Page -----------------
export default function Orders() {
  let { orders } = useLoaderData();

  return (
    <main className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4">
      <h1 className="col-span-full text-2xl font-bold mb-4">All Orders</h1>
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          orderId={order._id.toString()}
          userId={order.userId.toString()}
          status={order.status}
          total={order.total}
          createdAt={order.createdAt}
          delivery={order.delivery}
          payment={order.payment}
        />
      ))}
    </main>
  );
}

// ----------------- Order Card -----------------
export function OrderCard({
  orderId,
  userId,
  status,
  total,
  createdAt,
  delivery,
  payment,
}) {
  let statusColors = {
    pending: "bg-yellow-100 text-yellow-600",
    completed: "bg-green-100 text-green-600",
    cancelled: "bg-red-100 text-red-600",
  };

  return (
    <div className="flex flex-col justify-between gap-4 bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
      {/* Order Info */}
      <div>
        <h2 className="text-lg font-bold">Order #{orderId}</h2>
        <p className="text-gray-600 text-sm">Customer ID: {userId}</p>
      </div>

      {/* Order Details */}
      <div className="text-sm space-y-1">
        <span
          className={`inline-block px-2 py-1 text-xs rounded font-medium ${
            statusColors[status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <p>Total: ${total}</p>
        <p>Delivery: {delivery}</p>
        <p>Payment: {payment}</p>
        <p className="text-gray-500">
          Placed: {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Actions (example: mark as completed for pending orders) */}
      {status === "pending" && (
        <Form method="POST">
          <button
            name="orderId"
            value={orderId}
            className="w-full px-4 py-2  bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Mark as Completed
          </button>
        </Form>
      )}
    </div>
  );
}
