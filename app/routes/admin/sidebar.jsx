import { Link } from "react-router";
import {
  CircleDashed,
  ListOrdered,
  MessageCircleMore,
  ShoppingBasket,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";

export default function Sidebar({ loaderData }) {
  let items = [
    {
      to: "/users",
      icon: <UsersRound className="w-6 h-6" />,
      label: "New Users",
      count: loaderData.newUsers,
    },
    {
      to: "/orders",
      icon: <ListOrdered className="w-6 h-6" />,
      label: "Pending Orders",
      count: loaderData.ordersStats.pending,
    },
    {
      to: "/items",
      icon: <ShoppingBasket className="w-6 h-6" />,
      label: "All Items",
      count: loaderData.productCount,
    },
    {
      to: "/messages",
      icon: <MessageCircleMore className="w-6 h-6" />,
      label: "Messages",
      count: loaderData.messageCount,
    },
    {
      to: "/subscribes",
      icon: <UserRoundPlus className="w-6 h-6" />,
      label: "New Subscribers",
      count: loaderData.newSubscribes,
    },
    {
      to: "/orders",
      icon: <CircleDashed className="w-6 h-6" />,
      label: "Cancelled Orders",
      count: loaderData.ordersStats.cancelled,
    },
  ];

  return (
    <div
      className="flex flex-row md:flex-col gap-3 p-2 md:p-4 bg-white shadow-md
                 fixed md:absolute bottom-0 w-full md:top-20 md:rounded-r-3xl md:left-0 md:h-full md:w-48 z-10 justify-around"
    >
      {items.map((item, index) => (
        <Link
          to={item.to}
          key={index}
          className="relative flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start"
        >
          {item.icon}
          {/* Text hidden on small screens */}
          <p className="ml-1 mt-0 md:mt-0 text-xs md:text-base text-gray-700 hidden md:inline">
            {item.label}
          </p>

          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {item.count}
          </span>
        </Link>
      ))}
    </div>
  );
}
