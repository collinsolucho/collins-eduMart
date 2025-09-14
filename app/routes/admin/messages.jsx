import { data, redirect } from "react-router";
import { getAllMessages, getUserById } from "../../model/database";
import { commitSession, getSession } from "../../.server/session";

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  let user = await getUserById(userId);

  if (!user || user.role !== "admin") {
    return redirect("/");
  }

  let messages = await getAllMessages();

  return data(
    { messages },
    {
      headers: {
        "set-cookie": await commitSession(session),
      },
    }
  );
}

export default function Messages({ loaderData }) {
  let { messages } = loaderData;

  return (
    <main className="min-h-screen bg-gradient-to-tr from-blue-500 via-blue-600 to-blue-800 w-full p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 text-center mb-8 tracking-tight">
          💬 Messages Dashboard
        </h1>

        {messages.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">
            No messages found.
          </p>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message._id}
                className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-5 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-blue-700">
                    {message.name}
                  </h3>
                  <span className="text-xs text-blue-600 italic">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-800 mb-1">
                  <strong>Email:</strong> {message.email}
                </p>
                {message.tel && (
                  <p className="text-gray-800 mb-1">
                    <strong>Phone:</strong> {message.tel}
                  </p>
                )}
                <p className="text-gray-800">
                  <strong>Message:</strong> {message.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
