// export default function OrderDetails({ order, item }) {
//   return (
//     <main className="p-4 md:p-8 max-w-4xl mx-auto">
//       {/* Page Title */}
//       <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
//         Order Details
//       </h1>

//       {/* Order Info Card */}
//       <div className="bg-white shadow-md rounded-2xl p-4 md:p-6 mb-6">
//         <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
//           Order Information
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base text-gray-600">
//           <p>
//             <span className="font-medium text-gray-800">Order ID:</span>{" "}
//             {order._id}
//           </p>
//           <p>
//             <span className="font-medium text-gray-800">Status:</span>{" "}
//             <span
//               className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                 order.status === "pending"
//                   ? "bg-yellow-100 text-yellow-700"
//                   : order.status === "completed"
//                     ? "bg-green-100 text-green-700"
//                     : "bg-gray-100 text-gray-600"
//               }`}
//             >
//               {order.status}
//             </span>
//           </p>
//           <p>
//             <span className="font-medium text-gray-800">Total:</span> KES{" "}
//             {order.total}
//           </p>
//           <p>
//             <span className="font-medium text-gray-800">Date Placed:</span>{" "}
//             {new Date(order.createdAt).toLocaleString()}
//           </p>
//           <p>
//             <span className="font-medium text-gray-800">Shipping To:</span>{" "}
//             {order.shipping.town}, {order.shipping.county}
//           </p>
//           <p>
//             <span className="font-medium text-gray-800">Phone:</span>{" "}
//             {order.shipping.phone}
//           </p>
//           <p>
//             <span className="font-medium text-gray-800">Delivery:</span>{" "}
//             {order.delivery}
//           </p>
//           <p>
//             <span className="font-medium text-gray-800">Payment:</span>{" "}
//             {order.payment}
//           </p>
//         </div>
//       </div>

//       {/* Item Info Card */}
//       <div className="bg-white shadow-md rounded-2xl p-4 md:p-6">
//         <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
//           Item Details
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
//           {/* Image */}
//           {item.imageurl && (
//             <img
//               src={item.imageurl}
//               alt={item.name}
//               className="w-full h-56 object-cover rounded-lg shadow-sm"
//             />
//           )}

//           {/* Item Text */}
//           <div className="space-y-2 text-sm md:text-base text-gray-600">
//             <p>
//               <span className="font-medium text-gray-800">Item ID:</span>{" "}
//               {item._id}
//             </p>
//             <p>
//               <span className="font-medium text-gray-800">Name:</span>{" "}
//               {item.name}
//             </p>
//             <p>
//               <span className="font-medium text-gray-800">Price:</span> KES{" "}
//               {item.price}
//             </p>
//             <p>
//               <span className="font-medium text-gray-800">Quantity:</span>{" "}
//               {item.quantity}
//             </p>
//             <p>
//               <span className="font-medium text-gray-800">Category:</span>{" "}
//               {item.category}
//             </p>
//             <p className="text-gray-700">
//               <span className="font-medium text-gray-800">Description:</span>{" "}
//               {item.description}
//             </p>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
