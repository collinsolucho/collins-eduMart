import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),

  route("contactus", "routes/contactus.jsx"),

  route("products", "routes/products.jsx"),
  route("signup", "routes/signup.jsx"),
  route("login", "routes/login.jsx"),

  route("aboutus", "routes/aboutus.jsx"),
  route("cart", "routes/cart.jsx"),
  route("profile", "routes/profile/profile.jsx"),
  route("add", "routes/admin/add.jsx"),
  route("products/:id", "routes/productid.jsx"),
  route("products/:id/edit", "routes/admin/edit.jsx"),
  route("checkout", "routes/orders/checkout.jsx"),
  route("logout", "routes/logout.jsx"),
  route("profile/:id/edit", "routes/profile/editprofile.jsx"),
  route("admin", "routes/admin/admin.jsx"),
  route("users", "routes/admin/users.jsx"),
  route("orders", "routes/admin/orders.jsx"),
  route("items", "routes/admin/items.jsx"),
  route("messages", "routes/admin/messages.jsx"),
  route("subscribes", "routes/admin/subscribers.jsx"),
  route("devices", "routes/category/devices.jsx"),
  route("return", "routes/return/return.jsx"),
  route("profile/:orderid/item/:itemid", "routes/profile/orderdetails.jsx"),
];
