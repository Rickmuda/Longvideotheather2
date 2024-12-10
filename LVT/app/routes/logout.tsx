// app/routes/logout.tsx
import { redirect } from "@remix-run/node";
import { destroySession, getSession, requireUserId } from "../utils/auth.server";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request);

  const session = await getSession(request.headers.get("Cookie") || "");
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie") || "");
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export default function Logout() {
  return null; // This can be empty since we handle everything in the action
}
