import { Client, auth } from "twitter-api-sdk";

export const authClient = new auth.OAuth2User({
  client_id: process.env.TWITTER_CLIENT_ID as string,
  client_secret: process.env.TWITTER_CLIENT_SECRET as string,
  callback: "https://analyzr-dev.vercel.app/dashboard",
  scopes: ["tweet.read", "users.read", "offline.access"]
});

// 1. Get code from authURL when user authorizes
// 2. Use that code to get a access token or bearer token (refresh token also?)
// 3. Use this bearer token inside tempClient = new Client(bearer token)
// 4. Use tempClient.users.findMyUser to get the user's id (25 api requests per 24 hours only)
// 5. Use this id to get the tweets with their public metrics using tempClient.tweets.usersIdTweets (1 api request per 15 mins only)
