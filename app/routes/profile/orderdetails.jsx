import { redirect } from "react-router";
import { getSession } from "../../.server/session.js";
import { getOrderById } from "../../model/database";

export async function loader({ params, request }) {
  let { orderid, itemid } = params; //params should be named as from the route

  let session = await getSession(request.headers.get("Cookie"));
  let userId = session.get("userId");
  if (!userId) {
    return redirect("/login");
  }
  let order = await getOrderById(orderid);
  if (!order) {
    throw new Response("Order not found", { status: 404 });
  }
  let item = order.items.find((item) => item._id.toString() === itemid); //gets individual item by matching itemid(from params) from nested object in order returned
  if (!item) {
    throw new Response("product not found in this order", { status: 404 });
  }
  // console.log(item);
  return {
    order: {
      _id: order._id.toString(),
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      shipping: order.shipping,
      payment: order.payment,
      delivery: order.delivery,
    },

    item: {
      _id: item._id.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      category: item.category,
      description: item.description,
      imageurl: item.imageurl,
    },
  };
}

export default function Order({ loaderData }) {
  let { order, item } = loaderData;
  return <OrderDetails order={order} item={item} />;
}
