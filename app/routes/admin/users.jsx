import { commitSession, getSession } from "../../.server/session";
import { getAllUsers, updateUserbyId } from "../../model/database";
import { data, Form, redirect, useLoaderData } from "react-router";

// ----------------- Loader -----------------
export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  let users = await getAllUsers();

  return data(
    { users },
    { headers: { "set-cookie": await commitSession(session) } }
  );
}

export async function action({ request }) {
  let formData = await request.formData();
  let userId = formData.get("userId");
  let status = formData.get("status"); // "active" or "blocked"

  await updateUserbyId(userId, { isActive: status === "active" });
  return redirect("/users");
}

// ----------------- Users Page -----------------
export default function Users() {
  let { users } = useLoaderData();

  return (
    <main className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4">
      <h1 className="col-span-full text-2xl font-bold mb-4">All Users</h1>
      {users.map((user) => (
        <UserCard
          key={user._id}
          username={user.username}
          email={user.email}
          phone={user.phone}
          county={user.county}
          _id={user._id.toString()}
          createdAt={user.createdAt}
          isActive={user.isActive}
          role={user.role}
        />
      ))}
    </main>
  );
}

// ----------------- User Card -----------------
export function UserCard({
  username,
  email,
  phone,
  county,
  _id,
  createdAt,
  isActive,
  role,
}) {
  return (
    <div className="flex flex-col justify-between gap-4 bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
      {/* User Info */}
      <div>
        <h1 className="text-lg font-bold">{username}</h1>
        <h2 className="text-gray-600 text-sm">{email}</h2>
        <p className="text-xs text-gray-500 break-all">ID: {_id}</p>
      </div>

      {/* Contact */}
      <div className="text-sm space-y-1">
        <p>📞 {phone}</p>
        <p>🌍 {county}</p>
        <p className="text-gray-500">
          Joined: {new Date(createdAt).toLocaleDateString()}
        </p>
        <span
          className={`inline-block px-2 py-1 text-xs rounded font-medium ${
            isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {isActive ? "Active" : "Blocked"}
        </span>
      </div>

      {/* Actions — hidden if user is admin */}
      {role !== "admin" && (
        <Form method="post" className="w-full">
          <input type="hidden" name="userId" value={_id} />
          <input
            type="hidden"
            name="status"
            value={isActive ? "blocked" : "active"}
          />
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white rounded-lg ${
              isActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isActive ? "Block" : "Unblock"}
          </button>
        </Form>
      )}
    </div>
  );
}
