import axios from 'axios';

export const getBase64Encoded = (url: string): string => {
    const converted = btoa(url);
    return converted.substring(0, converted.length - 1);
};


const getToken = async (code: string) => {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            null,
            {
                params: {
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: encodeURI('http://localhost:3000/callback/'),
                    // client_id: process.env.SPOTIFY_CLIENT_ID,
                    // client_secret: process.env.SPOTIFY_CLIENT_SECRET,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${getBase64Encoded(
                        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                    )}`,
                },
            }
        );
        if (response.status === 200) {
            return response;
        }
    } catch (err) {
        return err;
    }
};

export default getToken;
