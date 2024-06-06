import { TwitchAuth, TwitchStream, VideoData } from '@/app/libs/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { NextResponse, type NextRequest } from 'next/server';
import querystring from 'querystring';

export async function GET(
	req: NextRequest
): Promise<NextResponse<VideoData | { error: string }>> {
	try {
		if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
			console.error(
				'Provide TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET env variables'
			);
			return NextResponse.json(
				{ error: 'Unknown server error' },
				{ status: 500 }
			);
		}
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');
		if (!id)
			return NextResponse.json(
				{ error: 'Provide video link or Id' },
				{ status: 400 }
			);
		const authQuery = querystring.stringify({
			client_id: process.env.TWITCH_CLIENT_ID,
			client_secret: process.env.TWITCH_CLIENT_SECRET,
			grant_type: 'client_credentials',
		});
		const resAuth: AxiosResponse<TwitchAuth> = await axios.post(
			'https://id.twitch.tv/oauth2/token?' + authQuery
		);
		const query = querystring.stringify({
			login: id,
		});
		const res: AxiosResponse<TwitchStream> = await axios.get(
			'https://api.twitch.tv/helix/users?' + query,
			{
				headers: {
					Authorization: 'Bearer ' + resAuth.data.access_token,
					'Client-Id': process.env.TWITCH_CLIENT_ID,
				},
				timeout: 10000,
			}
		);
		const data: VideoData = {
			host: 'twitch',
			id: res.data.data[0].id,
			channelId: res.data.data[0].login,
			name: res.data.data[0].display_name,
			iFrameSrcId: res.data.data[0].login,
			livestreamChat: true,
		};
		return NextResponse.json(data, { status: 200 });
	} catch (error: any) {
		if (error instanceof Response) {
			return NextResponse.json(
				{ error: error.statusText || 'Unknown server error' },
				{ status: error.status || 500 }
			);
		} else if (error instanceof AxiosError) {
			return NextResponse.json(
				{ error: error.message || 'Unknown server error' },
				{ status: error.status || 500 }
			);
		} else {
			return NextResponse.json(
				{ error: 'Unknown server error' },
				{ status: 500 }
			);
		}
	}
}
