import { redirect } from "react-router";
import {
  destroySession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from "../.server/session";

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  if (userId) {
    setSuccessMessage(session, "Logout successful!");
  } else {
    setErrorMessage(session, "Failed to logout. Please try again.");
  }
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let userId = session.get("userId");
  if (userId) {
    setSuccessMessage(session, "Logout successful!");
  } else {
    setErrorMessage(session, "Failed to logout. Please try again.");
  }
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
