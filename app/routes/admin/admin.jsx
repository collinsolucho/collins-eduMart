import { data, Link, redirect } from "react-router";
import { Search, PlusCircle } from "lucide-react";
import { useState } from "react";

import {
  getLatestOrders,
  getNewOrders,
  getNewUsersThisMonth,
  getOrdersCount,
  getOrdersRevenue,
  getOrdersStats,
  getProductCount,
  getUserCount,
  getUnreadMessages,
  countNewSubscribes,
  getUserById,
} from "../../model/database";

import { commitSession, getSession } from "../../.server/session";
import Sidebar from "./sidebar";

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  // Fetch the user by ID
  let user = await getUserById(userId);

  // Only allow admin users
  if (!user || user.role !== "admin") {
    return redirect("/"); // Redirect non-admin users
  }

  // Fetch dashboard data
  let ordersCount = await getOrdersCount();
  let userCount = await getUserCount();
  let productCount = await getProductCount();
  let newUsers = await getNewUsersThisMonth();
  let ordersStats = await getOrdersStats();
  let newOrders = await getNewOrders();
  let latestsOrders = await getLatestOrders();
  let revenue = await getOrdersRevenue();
  // Fetch count of unread messages only
  let unreadMessages = await getUnreadMessages();
  let messageCount = unreadMessages.length;
  let newSubscribes = await countNewSubscribes();
  return data(
    {
      ordersCount,
      userCount,
      productCount,
      newUsers,
      ordersStats,
      newOrders,
      latestsOrders,
      revenue,
      messageCount,
      newSubscribes,
      user,
    },
    {
      headers: {
        "set-cookie": await commitSession(session),
      },
    }
  );
}

export default function Admin({ loaderData }) {
  let [query, setQuery] = useState("");

  let filteredOrders = loaderData.latestsOrders.filter(
    (order) =>
      order._id.toLowerCase().includes(query.toLowerCase()) ||
      order.userId.toLowerCase().includes(query.toLowerCase()) ||
      order.status.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-t from-sky-500 to-indigo-500 w-full">
      {/* Sidebar */}
      <Sidebar loaderData={loaderData} />

      {/* Main Content */}
      <div className="flex flex-col gap-6 mt-24 md:mt-4 md:ml-52 p-4 md:p-7">
        {/* Header */}
        <div className="md:flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow">
              Welcome back, {loaderData.user.username}
            </h1>
            <p className="text-white/80 text-sm">Dashboard</p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-white p-2 text-gray-800 rounded shadow mt-2 md:mt-0">
            <input
              type="search"
              placeholder="Search orders..."
              className="px-2 py-1 border rounded text-sm focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-700" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          <div className="bg-white rounded-lg shadow p-4">
            <Link to="/users">
              <p className="text-sm text-gray-500">Total Users</p>
            </Link>
            <h3 className="text-2xl font-bold text-indigo-600">
              {loaderData.userCount}
            </h3>
          </div>

          <Link to="/orders">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold text-emerald-600">
                {loaderData.ordersCount}
              </h3>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Revenue</p>
            <h3 className="text-2xl font-bold text-yellow-600">
              Ksh {loaderData.revenue}
            </h3>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Messages</p>
            <h3 className="text-2xl font-bold text-red-600">
              {loaderData.messageCount}
            </h3>
          </div>
        </div>

        {/* Orders & Users Grid */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Orders box */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-700">Orders</h2>
                <Link to="/orders">
                  <p className="text-emerald-500 text-sm cursor-pointer hover:underline">
                    Completed orders: {loaderData.ordersStats.completed}
                  </p>
                </Link>
              </div>
              <p className="text-gray-500 text-sm">
                Last 7 days: {loaderData.newOrders} orders
              </p>
            </div>

            {/* Users box */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-1">
                Users
              </h2>
              <Link to="/users">
                <p className="text-sm text-blue-600 cursor-pointer hover:underline">
                  New users this month: {loaderData.newUsers}
                </p>
              </Link>
            </div>

            {/* Add Product Card */}
            <Link to="/add">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow p-6 hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer flex items-center justify-between ">
                <p className="text-md text-white font-medium">
                  Add New Product
                </p>
                <PlusCircle className="w- h-8 text-white" />
              </div>
            </Link>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Messages box */}
            <div className="bg-red-200 rounded-lg p-4 shadow">
              <h2 className="text-lg font-semibold text-white">Messages</h2>
              <p className="text-sm text-white">
                {loaderData.messageCount} new messages for past three days
              </p>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Recent Orders
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 border">Order ID</th>
                      <th className="px-4 py-2 border">Customer</th>
                      <th className="px-4 py-2 border">Status</th>
                      <th className="px-4 py-2 border">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{order._id}</td>
                        <td className="px-4 py-2 border">{order.userId}</td>
                        <td
                          className={`px-4 py-2 border font-medium ${
                            order.status === "completed"
                              ? "text-emerald-600"
                              : order.status === "pending"
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {order.status}
                        </td>
                        <td className="px-4 py-2 border">Ksh {order.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredOrders.length === 0 && (
                  <p className="text-center text-gray-500 mt-2">
                    No orders found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
