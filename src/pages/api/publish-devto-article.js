import { Novu } from "@novu/node";

const novu = new Novu(process.env.NEXT_PUBLIC_NOVU_API_KEY);

export const workflowTriggerID = "devto-notifications";

export default async function handler(req, res) {
  const { article } = req.body;

  const response = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.NEXT_PUBLIC_DEVTO_API_KEY,
    },
    body: JSON.stringify({ article: article }),
  });

  /**
   * Get response of the published article from Dev.to
   */
  const dataFromDevto = await response.json();

  /**
   * Extra the essential details needed from the Dev.to response
   */
  const { title, url, published_timestamp, user } = dataFromDevto;

  /**
   * Send notification that a new article has been published
   */
  sendInAppNotification(user, title, url);

  return res.json({ message: dataFromDevto });
}

/**
 * SEND IN-APP NOTIFICATION VIA NOVU
 * @param {*} userDetails
 * @param {*} articleTitle
 * @param {*} articleURL
 * @returns json
 */
async function sendInAppNotification(userDetails, articleTitle, articleURL) {
  await novu.trigger(workflowTriggerID, {
    to: {
      subscriberId: process.env.NEXT_PUBLIC_SUBSCRIBER_ID,
    },
    payload: {
      name: userDetails.name,
      article_url: articleURL,
      article_title: articleTitle,
      profile_image: userDetails.profile_image_90,
    },
  });

  return res.json({ finish: true });
}
