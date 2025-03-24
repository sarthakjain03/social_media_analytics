export async function GET(_request: Request) {
    const url = process.env.INSTAGRAM_EMBED_URL as string;

    return Response.redirect(url, 307);
}
