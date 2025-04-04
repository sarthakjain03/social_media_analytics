import axios from "axios";

export async function POST(request: Request) {
    try {
        const { code } = await request.json();
        const clientID = process.env.INSTAGRAM_APP_ID as string
        const clientSecret = process.env.INSTAGRAM_APP_SECRET as string
        const redirectUri = process.env.INSTAGRAM_CALLBACK_URI as string

        const formData = new URLSearchParams()
        formData.append('client_id', clientID);
        formData.append('client_secret', clientSecret);
        formData.append('grant_type', 'authorization_code');
        formData.append('redirect_uri', redirectUri);
        formData.append('code', code);

        const response = await axios.post('https://api.instagram.com/oauth/access_token', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })

        if (response?.data?.access_token) {
            return Response.json({
                success: true,
                message: "Short-term access token generated successfully!",
                data: {
                    accessToken: response?.data?.access_token
                }
            }, { status: 200 })
        }

        return Response.json({
            success: false,
            message: "Invalid response handling"
        }, { status: 400 })
        
    } catch (error) {
        console.error("Error generating token for Instagram user: ", error);
        return Response.json({
            success: false,
            message: "Error ugenerating token for Instagram user"
        }, { status: 500 });
    }
}