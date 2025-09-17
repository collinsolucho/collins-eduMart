import { data, Form, redirect, useLoaderData } from "react-router";
import {
  getNewSubscribers,
  getUserById,
  updateSubscriberRead,
} from "../../model/database";
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

  let items = subscribes.map((subcribers) => ({
    ...subcribers,
    _id: subcribers._id.toString(),
  }));

  return data(
    { subscribes: items },
    {
      headers: {
        "set-cookie": await commitSession(session),
      },
    }
  );
}

export async function action({ request }) {
  let formData = await request.formData();
  let _action = formData.get("_action");

  if (_action === "mark-read") {
    let id = formData.get("id");
    await updateSubscriberRead(id);
    return redirect("/subscribes");
  }

  return null;
}

export default function Subscribers() {
  let { subscribes } = useLoaderData();
  console.log(subscribes);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 w-full p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-8 flex items-center justify-center gap-2">
          📩 Subscribers Dashboard
        </h1>

        {subscribes.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center text-lg">
            No subscribers found in the last 7 days.
          </p>
        ) : (
          <div className="space-y-4">
            {subscribes.map((subscribe) => (
              <div
                key={subscribe._id}
                className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow border border-gray-200 dark:border-gray-600"
              >
                <div className="flex justify-between items-center">
                  <p className="text-gray-900 dark:text-white font-medium">
                    ✉️ {subscribe.email}
                  </p>
                  <span className="text-xs text-gray-600 dark:text-gray-400 italic">
                    {new Date(subscribe.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Status */}
                {subscribe.read ? (
                  <span className="mt-2 inline-block text-green-600 dark:text-green-400 text-sm font-medium">
                    ✅ Read
                  </span>
                ) : (
                  <Form method="post" className="mt-3">
                    <input type="hidden" name="_action" value="mark-read" />
                    <input type="hidden" name="id" value={subscribe._id} />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Mark as Read
                    </button>
                  </Form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
