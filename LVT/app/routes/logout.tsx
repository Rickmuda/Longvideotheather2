// app/routes/logout.tsx
import { redirect } from "@remix-run/node";
// eslint-disable-next-line import/no-unresolved
import { requireUserId } from "~/utils/auth.server";

import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request);
  
  // Your logout logic here, e.g., clearing the session
  // Example: await logoutUser(request);

  // Redirect to the main page after logging out
  return redirect("/"); // Assuming index.tsx is your main page
};

export default function Logout() {
  return null; // This can be empty since we handle everything in the action
}
