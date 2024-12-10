import { json, ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { login, createUserSession } from "../utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  console.log(`Login attempt: ${email}`);

  if (typeof email !== "string" || typeof password !== "string") {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  const user = await login(email, password);
  if (!user) {
    return json({ error: "Invalid email or password" }, { status: 400 });
  }

  return createUserSession(user.id, "/");
};

export default function Login() {
  const actionData = useActionData<{ error?: string }>();

  return (
    <div>
      <h1>Login</h1>
      <Form method="post" className="login-form">
        <div>
          <label>
            Email:
            <input type="email" name="email" required />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input type="password" name="password" required />
          </label>
        </div>
        {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}
