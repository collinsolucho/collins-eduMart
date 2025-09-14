import {
  getSession,
  commitSession,
  setErrorMessage,
  setSuccessMessage,
} from "../../.server/session.js";
import { Form, redirect, useNavigation } from "react-router";
import { getUserById, updateUserbyId } from "../../model/database";
import { counties } from "../../components/counties";

export async function loader({ params, request }) {
  let personId = params.id;
  let session = await getSession(request.headers.get("Cookie"));
  let userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  let user = await getUserById(userId);
  user._id = user._id.toString();
  return user;
}
export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();

  let id = formData.get("_id");

  let updateData = {
    username: formData.get("name"),
    email: formData.get("email"),
    town: formData.get("town"),
    county: formData.get("county"),
    phone: formData.get("phone"),
  };

  let result = await updateUserbyId(id, updateData);
  if (result.acknowledged) {
    setSuccessMessage(session, "details updated succesfully!");
  } else {
    setErrorMessage(session, "failed to update details. please try again");
  }

  return redirect("/profile", {
    headers: {
      "set-cookie": await commitSession(session),
    },
  });
}

export default function EditUser({ loaderData }) {
  let navigation = useNavigation();

  let isSubmitting = navigation.state !== "idle";
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Dessert</h1>
      <Form method="post" className="flex flex-col gap-4">
        <input type="hidden" name="_id" value={loaderData._id} />

        <label>
          Name:
          <input
            type="text"
            required
            name="name"
            defaultValue={loaderData.username}
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          Email:
          <input
            required
            type="email"
            name="email"
            defaultValue={loaderData.email}
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          Phone:
          <input
            required
            type="tel"
            name="phone"
            defaultValue={loaderData.phone}
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          County:
          <select
            name="county"
            required
            defaultValue={loaderData.county}
            className="border p-2 rounded w-full"
          >
            <option value=""> Select County</option>
            {counties.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>
        </label>

        <label>
          town:
          <input
            required
            type="text"
            name="town"
            defaultValue={loaderData.town}
            className="border p-2 rounded w-full"
          />
        </label>

        <button
          type="submit"
          required
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></span>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </Form>
    </main>
  );
}
