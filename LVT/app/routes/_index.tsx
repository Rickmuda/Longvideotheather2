// app/routes/videos.tsx
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { useState } from "react";
import axios from "axios";
import { prisma } from "../../prisma/prisma.server";
// eslint-disable-next-line import/no-unresolved
import { requireUserId } from "~/utils/auth.server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request); // Check if user is logged in
  const videos = await prisma.video.findMany();
  return json({ videos, userId });
};

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request);

  const formData = await request.formData();
  const url = formData.get("url");
  const category = formData.get("category");

  // Check if URL and category are valid
  if (typeof url !== "string" || !url.trim() || typeof category !== "string") {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  // Check if the URL is a valid YouTube link
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
  userId: string | null; // Change to allow null for logged out users
}

interface ActionData {
  error?: string;
}

export default function Videos({ setPage, setData }: VideosProps) {
  const { videos, userId } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const [category, setCategory] = useState("Videogames");

  return (
    <div>
      <h1>Long Video Theater</h1>
      
      {/* Add Video Form: Only show if the user is logged in */}
      {userId && (
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
      )}

      {/* Category Buttons */}
      <div className="category-buttons">
        <button onClick={() => setCategory("Videogames")}>Videogames</button>
        <button onClick={() => setCategory("Anime/Manga")}>Anime/Manga</button>
        <button onClick={() => setCategory("Alternate Reality Game")}>Alternate Reality Game</button>
        <button onClick={() => setCategory("Digital")}>Digital Horror</button>
      </div>

      {/* Video Grid */}
      <div className="video-grid">
        {videos && videos.length > 0 ? (
          videos.filter(video => video.category === category).map(video => (
            <div key={video.id} className="video-item">
              <h2>{video.title}</h2>
              <div className='thumbnail'>
                <button onClick={() => { setPage("explenation"); setData(video); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    <img src={video.thumbnail} alt={video.title} />
                  </a>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No videos found.</p>
        )}
      </div>
      {actionData?.error && <p>{actionData.error}</p>}
    </div>
  );
}
