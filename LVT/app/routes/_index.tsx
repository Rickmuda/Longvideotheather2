// app/routes/videos.tsx
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, useActionData, Form, Link } from "@remix-run/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { prisma } from "../../prisma/prisma.server";
import { getUserId } from "../utils/auth.server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  const videos = await prisma.video.findMany();
  return json({ videos, userId });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    return json({ error: "You must be logged in to add a video" }, { status: 401 });
  }

  const formData = await request.formData();
  const url = formData.get("url");
  const category = formData.get("category");

  if (typeof url !== "string" || !url.trim() || typeof category !== "string") {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  let videoId = url.split("v=")[1];
  if (!videoId) {
    return json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  const ampersandPosition = videoId.indexOf("&");
  if (ampersandPosition !== -1) {
    videoId = videoId.substring(0, ampersandPosition);
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`
    );

    if (!response.data.items.length) {
      return json({ error: "No video found with that ID" }, { status: 404 });
    }

    const { title, channelTitle: creator, thumbnails } = response.data.items[0].snippet;
    const thumbnail = thumbnails.high.url;

    const video = await prisma.video.create({
      data: { title, creator, url, thumbnail, category },
    });

    return json(video);
  } catch (error) {
    console.error("Error fetching video details:", error);
    return json({ error: "Failed to fetch video details" }, { status: 500 });
  }
};

interface VideosProps {
  setPage: (page: "essays" | "explenation") => void; 
  setData: (data: unknown) => void;
}

interface Video {
  id: string;
  title: string;
  creator: string;
  url: string;
  thumbnail: string;
  category: string; 
}

interface LoaderData {
  videos: Video[];
  userId: string | null; 
}

interface ActionData {
  error?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Videos({ setPage, setData }: VideosProps) {
  const { videos, userId } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const [category, setCategory] = useState("Videogames");
  const [isLoggedIn, setIsLoggedIn] = useState(!!userId);

  useEffect(() => {
    setIsLoggedIn(!!userId);
  }, [userId]);

  const handleLogout = async () => {
    try {
      await fetch('/logout', { method: 'POST' });
      setIsLoggedIn(false);
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div>
      <h1>Long Video Theater</h1>
      
      {isLoggedIn ? (
        <>
          <div className="add-video-container">
            <Form method="post">
              <input type="text" name="url" placeholder="YouTube Video URL" required />
              <select name="category" required defaultValue="">
                <option value="" disabled>Select a category</option>
                <option value="Videogames">Videogames</option>
                <option value="Anime/Manga">Anime/Manga</option>
                <option value="Alternate Reality Game">Alternate Reality Game</option>
                <option value="Digital">Digital Horror</option>
              </select>
              <button type="submit">Add Video</button>
            </Form>
          </div>
          <div className="logout-container">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </>
      ) : (
        <div className="login-container">
          <button onClick={() => window.location.href = '/login'}>Login</button>
        </div>
      )}

      <div className="category-buttons">
        <button onClick={() => setCategory("Videogames")}>Videogames</button>
        <button onClick={() => setCategory("Anime/Manga")}>Anime/Manga</button>
        <button onClick={() => setCategory("Alternate Reality Game")}>Alternate Reality Game</button>
        <button onClick={() => setCategory("Digital")}>Digital Horror</button>
      </div>

      <div className="videos-list">
        {videos.filter(video => video.category === category).map(video => (
          <div key={video.id} className="video-item">
            <a href={video.url} target="_blank" rel="noreferrer">
              <img src={video.thumbnail} alt={video.title} />
            </a>
            <h3>{video.title}</h3>
            <p>{video.creator}</p>
          </div>
        ))}
      </div>

      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
    </div>
  );
}
