import { data, Form, redirect, useLoaderData } from "react-router";
import { getAllMessages, updateMessageRead } from "../../model/database";

export async function loader() {
  let messages = await getAllMessages();
  let items = messages.map((item) => {
    return {
      ...item,
      _id: item._id.toString(),
    };
  });
  return data({ messages: items });
}

export async function action({ request }) {
  let formData = await request.formData();
  let _action = formData.get("_action");

  if (_action === "mark-read") {
    let id = formData.get("id");
    await updateMessageRead(id);
    return redirect("/messages");
  }

  return null;
}

export default function Messages() {
  let { messages } = useLoaderData();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          📩 Messages
        </h1>

        {/* Messages list */}
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className="p-4 sm:p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {message.name}
                </h3>
                {message.read ? (
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-1">
                    ✅ Read
                  </span>
                ) : (
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1">
                    ✉️ Unread
                  </span>
                )}
              </div>

              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {message.message}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                📧 {message.email}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                📞 {message.tel}
              </p>

              {!message.read && (
                <Form method="post" className="mt-3">
                  <input type="hidden" name="_action" value="mark-read" />
                  <input type="hidden" name="id" value={message._id} />
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
      </div>
    </main>
  );
}
