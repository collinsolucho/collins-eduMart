import { client, ObjectId } from "../.server/mongo";
import bcrypt from "bcrypt";

let db = client.db("commerce");
let collection = db.collection("commerce"); // products
let credentials = db.collection("credentials"); // users
let orders = db.collection("orders");
let subscribes = db.collection("subscribes");
let message = db.collection("message");

export async function getItem() {
  const items = await collection.find().toArray();

  return items.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));
}

export async function addItem(item) {
  return collection.insertOne({
    ...item,
    createdAt: new Date(),
  });
}

export async function removeItem(id) {
  return collection.deleteOne({ _id: new ObjectId(id) });
}

export async function updateItem(id, updateData) {
  return collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
}

export async function getItemById(id) {
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function getProductCount() {
  let count = await db.collection("commerce").countDocuments();
  return count;
}
// ------------------ Users ------------------
export async function addPerson(item) {
  const newPerson = {
    ...item,
    town: item.town || "",
    county: item.county || "",
    createdAt: new Date(),
    isActive: true,
  };

  return credentials.insertOne(newPerson);
}

export async function authenticateUser(email, password, username) {
  const user = await credentials.findOne({ email, username });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return user;
}

export async function getUserById(id) {
  return credentials.findOne({ _id: new ObjectId(id) });
}
export async function updateUserbyId(id, updateData) {
  return credentials.updateOne(
    {
      _id: ObjectId.createFromHexString(id),
    },
    {
      $set: {
        ...updateData,
      },
    }
  );
}
export async function getUserCount() {
  let count = await db.collection("credentials").countDocuments();
  return count;
}

export async function getNewUsersThisMonth() {
  let now = new Date();
  let startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let count = await db.collection("credentials").countDocuments({
    createdAt: { $gte: startOfMonth },
  });

  return count;
}

export async function getAllUsers() {
  let users = await credentials
    .find()
    .sort({ createdAt: -1 }) // newest first
    .toArray();

  // Convert _id to string
  return users.map((user) => ({
    ...user,
    _id: user._id.toString(),
  }));
}

export async function createOrder(order) {
  return orders.insertOne({
    ...order,
    status: "pending",
    createdAt: new Date(),
  });
}
export async function getOrdersCount() {
  let count = await db.collection("orders").countDocuments();
  return count;
}
export async function getAllOrders() {
  return await orders
    .find()
    .sort({ createdAt: -1 }) // newest users first
    .toArray();
}

export async function getOrdersStats() {
  let pending = await db
    .collection("orders")
    .countDocuments({ status: "pending" });
  let completed = await db
    .collection("orders")
    .countDocuments({ status: "completed" });
  let cancelled = await db
    .collection("orders")
    .countDocuments({ status: "cancelled" });

  return { pending, completed, cancelled };
}
export async function getNewOrders() {
  let now = new Date();
  let sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7); // 7 days back

  let count = await db.collection("orders").countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  return count;
}
export async function getLatestOrders() {
  let orders = await db
    .collection("orders")
    .find()
    .sort({ createdAt: -1 }) // -1 = descending (newest first)
    .limit(5) // take only `limit` orders
    .toArray();
  return orders.map((order) => ({
    ...order,
    userId: order.userId.toString(),
    _id: order._id.toString(),
  }));
}

export async function getOrders() {
  let allOrders = await orders.find().toArray();

  return allOrders.map((order) => ({
    ...order,
    _id: order._id.toString(),
    userId: order.userId.toString(),
    items: order.items.map((item) => ({
      ...item,
      _id: item._id.toString(), // convert nested item _id to string
    })),
  }));
}

export async function pendingOrders() {
  let pending = await db
    .collection("orders")
    .countDocuments({ status: "pending" });
  return pending;
}
export async function completedOrders() {
  let completed = await db
    .collection("orders")
    .countDocuments({ status: "completed" });
  return completed;
}
export async function addOrder(orderData) {
  return orders.insertOne({
    ...orderData,
    createdAt: new Date(),
    status: "pending",
  });
}

export async function getOrdersByUser(userId) {
  return orders.find({ userId: new ObjectId(userId) }).toArray();
}

export async function getOrderById(orderid) {
  return orders.findOne({
    _id: ObjectId.createFromHexString(orderid),
  });
}

export async function updateOrderStatus(id, status) {
  return orders.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } }
  );
}
export async function orderUpdate(orderId) {
  let result = await orders.updateOne(
    { _id: new ObjectId(orderId) },
    { $set: { status: "completed" } }
  );

  return result;
}
export async function getOrdersRevenue() {
  let result = await db
    .collection("orders")
    .aggregate([
      { $match: { status: "completed" } }, // only consider completed orders
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } }, // sum the 'total' field
    ])
    .toArray();

  return result[0]?.totalRevenue || 0; // return 0 if no completed orders
}

export async function addSubscriber(email) {
  if (!email) throw new Error("Email is required");

  return subscribes.insertOne({
    email: email.toLowerCase().trim(),
    createdAt: new Date(),
    read: false,
  });
}

export async function addMessage(item) {
  return message.insertOne({
    ...item,
    createdAt: new Date(),
    read: false,
  });
}

export async function getAllMessages() {
  return message.find().sort({ createdAt: -1 }).toArray();
}
export async function getMessageCount() {
  let count = await db.collection("message").countDocuments();
  return count;
}
export async function getNewSubscribers() {
  let sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return await subscribes.find({ createdAt: { $gte: sevenDaysAgo } }).toArray();
}
export async function countNewSubscribes() {
  let threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  return await subscribes.countDocuments({
    createdAt: { $gte: threeDaysAgo },
  });
}

export async function updateSubscriberRead(id) {
  return subscribes.updateOne(
    { _id: new ObjectId(id) },
    { $set: { read: true } }
  );
}

export async function updateMessageRead(id) {
  return message.updateOne({ _id: new ObjectId(id) }, { $set: { read: true } });
}

export async function getUnreadSubscribers() {
  let sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return await subscribes
    .find({ read: false, createdAt: { $gte: sevenDaysAgo } })
    .toArray();
}

export async function getUnreadMessages() {
  return message.find({ read: false }).sort({ createdAt: -1 }).toArray();
}
