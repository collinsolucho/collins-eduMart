import { redirect } from "react-router";
import { commitSession } from "../.server/session";

export async function action() {
  return redirect("/", {
    headers: {
      "set-cookie": await commitSession(session, { maxAge: 0 }),
    },
  });
}
