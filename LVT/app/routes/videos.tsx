// app/routes/videos.tsx
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { useState } from "react";
import axios from "axios";
import { prisma } from "../../prisma/prisma.server";
import { requireUserId } from "~/utils/auth.server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export let loader: LoaderFunction = async ({ request }) => {
  let videos = await prisma.video.findMany();
  return json(videos);
};

export let action: ActionFunction = async ({ request }) => {
  await requireUserId(request);

  let formData = await request.formData();
  let url = formData.get("url");
  let category = formData.get("category");

  if (typeof url !== "string" || typeof category !== "string") {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  let videoId = url.split("v=")[1];
  const ampersandPosition = videoId.indexOf("&");
  if (ampersandPosition !== -1) {
    videoId = videoId.substring(0, ampersandPosition);
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`
    );

    const { title, channelTitle: creator, thumbnails } = response.data.items[0].snippet;
    const thumbnail = thumbnails.high.url;

    let video = await prisma.video.create({
      data: { title, creator, url, thumbnail, category },
    });

    return json(video);
  } catch (error) {
    console.error("Error fetching video details:", error);
    return json({ error: "Failed to fetch video details" }, { status: 500 });
  }
};

export default function Videos({ setPage, setData }) {
  const videos = useLoaderData();
  const actionData = useActionData();
  const [category, setCategory] = useState("Videogames");

  return (
    <div>
      <h1>Long Video Theater</h1>
      <div>
        <button onClick={() => setCategory("Videogames")}>Videogames</button>
        <button onClick={() => setCategory("Anime/Manga")}>Anime/Manga</button>
        <button onClick={() => setCategory("Alternate Reality Game")}>Alternate Reality Game</button>
        <button onClick={() => setCategory("Digital")}>Digital Horror</button>
      </div>
      <ul>
        {videos && videos.length > 0 ? (
          videos.filter(video => video.category === category).map(video => (
            <li key={video.id}>
              <h2>{video.title}</h2>
              <div className='thumbnail'>
                <div onClick={() => { setPage("explenation"); setData(video) }}>
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    <img src={video.thumbnail} alt={video.title} />
                  </a>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No videos found.</p>
        )}
      </ul>
      <Form method="post">
        <input type="text" name="url" placeholder="YouTube Video URL" />
        <input type="text" name="category" placeholder="Category" />
        <button type="submit">Add Video</button>
      </Form>
      {actionData?.error && <p>{actionData.error}</p>}
    </div>
  );
}
