export async function GET(request: Request) {
    const url = process.env.INSTAGRAM_EMBED_URL as string;
    console.log("URL: ", url)

    return Response.redirect(url, 307);
}
