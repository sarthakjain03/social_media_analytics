import { authClient } from "@/actions/twitterAuth";

export async function GET(request: Request) {
  const url = authClient.generateAuthURL({
    state: process.env.TWITTER_AUTH_STATE as string,
    code_challenge_method: "s256",
  });

  return Response.redirect(url, 307);
}
