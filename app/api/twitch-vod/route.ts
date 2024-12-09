import { TwitchAuth, TwitchVOD, VideoData } from '@/libs/types';
import { formatFetchError } from '@/libs/utils';
import axios, { AxiosResponse } from 'axios';
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
			id: id,
		});
		const res: AxiosResponse<TwitchVOD> = await axios.get(
			'https://api.twitch.tv/helix/videos?' + query,
			{
				headers: {
					Authorization: 'Bearer ' + resAuth.data.access_token,
					'Client-Id': process.env.TWITCH_CLIENT_ID,
				},
				timeout: 10000,
			}
		);
		const data: VideoData = {
			host: 'twitch-vod',
			id: res.data.data[0].id,
			title: res.data.data[0].title,
			channelId: res.data.data[0].user_id,
			channelName: res.data.data[0].user_name,
			livestreamChat: true,
			thumbnailUrl: res.data.data[0].thumbnail_url.replace(
				'%{width}x%{height}',
				'120x90'
			),
		};
		return NextResponse.json(data, { status: 200 });
	} catch (error: unknown) {
		return formatFetchError(error);
	}
}
