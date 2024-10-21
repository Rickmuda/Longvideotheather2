// app/root.tsx
import type { LinksFunction } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: "/styles/styles.css" }]; // Note the leading '/' indicating the root
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
