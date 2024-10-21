// app/routes/addVideo.tsx
import { ActionFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { requireUserId } from "../utils/auth.server";
import { prisma } from "../../prisma/prisma.server";
import axios from "axios";


const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;


export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request);

  // eslint-disable-next-line prefer-const
  let formData = await request.formData();
  // eslint-disable-next-line prefer-const
  let url = formData.get("url");
  // eslint-disable-next-line prefer-const
  let category = formData.get("category");

  if (typeof url !== "string" || typeof category !== "string") {
    return { error: "Invalid form data" };
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const video = await prisma.video.create({
      data: { title, creator, url, thumbnail, category },
    });

    return redirect("/");
  } catch (error) {
    console.error("Error fetching video details:", error);
    return { error: "Failed to fetch video details" };
  }
};

export default function AddVideo() {
  const actionData = useActionData<{ error?: string }>();
  return (
    <div>
      <h1>Add a New Video</h1>
      <Form method="post" className="login-form">
        <div>
          <label>
            YouTube Video URL: <input type="text" name="url" />
          </label>
        </div>
        <div>
          <label>
            Category: <input type="text" name="category" />
          </label>
        </div>
        <button type="submit">Add Video</button>
      </Form>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
    </div>
  );
}
