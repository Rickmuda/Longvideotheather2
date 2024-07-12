// app/routes/logout.tsx
import { ActionFunction } from "@remix-run/node";
import { logout } from "../utils/auth.server";

export let action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export default function Logout() {
  return (
    <Form method="post">
      <button type="submit">Logout</button>
    </Form>
  );
}
