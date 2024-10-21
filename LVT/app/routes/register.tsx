// app/routes/register.tsx
import { ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createUser } from "../utils/auth.server";
import { prisma } from "../../prisma/prisma.server"; // Import the prisma client

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  console.log(`Registration attempt: ${email}`);

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid form data" };
  }

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "User already exists" };
  }

  const user = await createUser(email, password);
  if (!user) {
    return { error: "User creation failed" };
  }

  return { success: "User registered successfully" };
};

export default function Register() {
  const actionData = useActionData<{ error?: string; success?: string }>();

  return (
    <div>
      <h1>Register</h1>
      <Form method="post">
        <div>
          <label>
            Email: <input type="email" name="email" required autoComplete="email" />
          </label>
        </div>
        <div>
          <label>
            Password: <input type="password" name="password" required autoComplete="new-password" />
          </label>
        </div>
        <button type="submit">Register</button>
      </Form>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
      {actionData?.success && <p style={{ color: "green" }}>{actionData.success}</p>}
    </div>
  );
}
