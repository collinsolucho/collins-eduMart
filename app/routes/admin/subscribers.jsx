import { data, redirect } from "react-router";
import { getNewSubscribers, getUserById } from "../../model/database";
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

  let subscribes = await getNewSubscribers();

  return data(
    { subscribes },
    {
      headers: {
        "set-cookie": await commitSession(session),
      },
    }
  );
}

export default function Subscribers({ loaderData }) {
  let { subscribes } = loaderData;

  return (
    <main className="min-h-screen bg-gradient-to-tr from-blue-500 via-blue-600 to-blue-800 w-full p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 text-center mb-8 tracking-tight">
          📩 Subscribers Dashboard
        </h1>

        {subscribes.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">
            No subscribers found in the last 7 days.
          </p>
        ) : (
          <div className="space-y-6">
            {subscribes.map((subscribe) => (
              <div
                key={subscribe._id}
                className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-5 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  {/* Email */}
                  <p className="text-blue-900 font-medium">
                    ✉️ {subscribe.email}
                  </p>

                  {/* Date */}
                  <span className="text-xs text-blue-600 italic">
                    {new Date(subscribe.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
