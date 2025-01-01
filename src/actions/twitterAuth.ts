import { Client, auth } from "twitter-api-sdk";

// Initialize auth client first
export const authClient = new auth.OAuth2User({
  client_id: process.env.TWITTER_CLIENT_ID as string,
  client_secret: process.env.TWITTER_CLIENT_SECRET as string,
  callback: process.env.TWITTER_CALLBACK_URI as string,
  scopes: ["tweet.read", "users.read", "offline.access"]
});

export const getNewAuthClient = (accessToken: string) => {
  const client = new Client(accessToken);
  
  return client;
}

export const getTwitterAuthUrl = () => {
  const url = authClient.generateAuthURL({
    state: process.env.TWITTER_AUTH_STATE as string,
    code_challenge_method: "s256"
  });
  return url;
}


// 1. Get code from authURL when user authorizes
// 2. Use that code to get a access token or bearer token (refresh token also?)
// 3. Use this bearer token inside tempClient = new Client(bearer token)
// 4. Use tempClient.users.findMyUser to get the user's id (25 api requests per 24 hours only)
// 5. Use this id to get the tweets with their public metrics using tempClient.tweets.usersIdTweets (1 api request per 15 mins only)