// app/utils/auth.server.ts
import { createCookieSessionStorage, redirect, Session } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { prisma } from "../../prisma/prisma.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 1 month
    httpOnly: true,
  },
});

export async function getSession(cookieHeader: string) {
  return storage.getSession(cookieHeader);
}

export async function destroySession(session: Session) {
  return storage.destroySession(session);
}

export async function requireUserId(request: Request) {
  const session = await getSession(request.headers.get("Cookie") || "");
  const userId = session.get("userId");
  if (!userId) throw redirect("/login");
  return userId;
}

interface User {
  id: string;
  email: string;
}

export async function login(email: string, password: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }

  return { id: user.id, email: user.email };
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getUserId(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId || typeof userId !== "number") return null;
  return userId;
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword, // Store the hashed password
    },
  });
  console.log(`User created: ${email}`);
  return user;
}
