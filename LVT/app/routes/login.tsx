// app/routes/login.tsx
import { ActionFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { login } from "../utils/auth.server";
import styles from "../styles/styles.css";

export let action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid form data" };
  }

  const userSession = await login(email, password);
  if (!userSession) {
    return { error: "Invalid email or password" };
  }

  return userSession;
};

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function Login() {
  const actionData = useActionData();
  return (
    <div>
      <h1>Login</h1>
      <Form method="post" className="login-form">
        <div>
          <label>
            Email: <input type="email" name="email" />
          </label>
        </div>
        <div>
          <label>
            Password: <input type="password" name="password" />
          </label>
        </div>
        <button type="submit">Login</button>
      </Form>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
    </div>
  );
}
