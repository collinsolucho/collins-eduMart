import { redirect, useActionData } from "react-router";
import { commitSession, getSession } from "../.server/session.js";
import { validateUser } from "../.server/validation.js";
import { AuthField, AuthLayout } from "../components/featured";
import { createAccount } from "../.server/hashpassword";

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let user = session.get("user");

  if (user) {
    // already logged in → send to homepage
    return redirect("/");
  }

  return null; // stay on signup page
}
//get request changes url and puts in search params
//post request puts values in form
export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  // let user = session.get("user") || [];
  let formData = await request.formData();
  let username = String(formData.get("username") || "").trim();
  let confirm = String(formData.get("confirm") || "").trim();
  let phone = String(formData.get("phone") || "").trim();
  let email = String(formData.get("email") || "").trim();
  let password = String(formData.get("password") || "").trim();
  // let person = { email, password, username, phone };
  if (password !== confirm) {
    return { errors: { confirm: "Passwords do not match" } };
  }
  let errors = validateUser(email, password, username);
  if (errors) {
    return { errors };
  }
  // let result = await addPerson(person);
  let user = await createAccount(email, password, username, phone);
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Signup() {
  return (
    <AuthLayout>
      <AuthField
        title="Create Account"
        message="Already have an account?"
        route="/login"
        routeText="Login"
        includeName
        includeConfirmPassword
        includePhone
        checkboxText="I agree to terms and condition"
        submitLabel="Sign up"
        // errors={useActionData?.errors}
      />
    </AuthLayout>
  );
}
