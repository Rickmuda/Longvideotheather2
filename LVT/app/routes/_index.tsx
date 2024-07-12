// app/routes/index.tsx
import { useState, useEffect } from "react";
import { Link, Form, useNavigate, useLoaderData } from "@remix-run/react";
import { getUserId } from "../utils/auth.server";
import Videoessays from "./videos";
import Explenation from "./explenation";
import styles from "../styles/styles.css";

export let loader = async ({ request }) => {
  const userId = await getUserId(request);
  return { userId };
};

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function Index() {
  const { userId } = useLoaderData();
  const [page, setPage] = useState("essays");
  const [data, setData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(userId !== null);
  }, [userId]);

  const handleLogout = async () => {
    await fetch("/logout", { method: "POST" });
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            {isLoggedIn ? (
              <button className="login-logout-button" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link to="/login" className="login-logout-button">
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
      <div>
        {page === "essays" && <Videoessays setPage={setPage} setData={setData} />}
        {page === "explenation" && data && <Explenation setPage={setPage} Data={data} />}
      </div>
      {isLoggedIn && (
        <div>
          <Link to="/addVideo" className="add-video-button">
            Add Video
          </Link>
        </div>
      )}
    </div>
  );
}
