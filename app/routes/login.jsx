import { redirect } from "react-router";
import {
  commitSession,
  getSession,
  setSuccessMessage,
  setErrorMessage,
} from "../.server/session.js";
import { AuthField, AuthLayout } from "../components/featured";
import { validateUser } from "../.server/validation.js";
import { authenticateUser } from "../model/database";

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let email = String(formData.get("email") || "").trim();
  let password = String(formData.get("password") || "").trim();
  let username = String(formData.get("username") || "").trim();

  let errors = validateUser(email, password, username);
  if (errors) {
    return errors;
  }

  // Authenticate user with email and password
  let user = await authenticateUser(email, password, username);

  if (!user) {
    return { errors: { general: "Invalid email or password" } };
  } // Store user ID in session

  session.set("userId", user._id.toString());
  session.set("userRole", user.role);
  // Redirect based on role
  let redirectTo = user.role === "admin" ? "/admin" : "/";
  if (user) {
    setSuccessMessage(session, "Login successful!");
  } else {
    setErrorMessage(session, "Failed to login. Please try again.");
  }

  return redirect(redirectTo, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
export default function Login() {
  return (
    <AuthLayout>
      <AuthField
        title="sign in to your account"
        message="Not a member?"
        route="/signup"
        routeText="Sign up"
        includeName
        checkboxText="Remember me for 30 days"
        reset
        submitLabel="Sign in"
        divider
      />
    </AuthLayout>
  );
}
