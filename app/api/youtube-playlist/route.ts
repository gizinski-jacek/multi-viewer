import { VideoData, YoutubeResponse } from '@/app/libs/types';
import { fetchErrorFormat } from '@/app/libs/utils';
import axios, { AxiosResponse } from 'axios';
import { NextResponse, type NextRequest } from 'next/server';
import querystring from 'querystring';

export async function GET(
	req: NextRequest
): Promise<NextResponse<VideoData | { error: string }>> {
	try {
		if (!process.env.YOUTUBE_API_KEY) {
			console.error('Provide YOUTUBE_API_KEY env variables');
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
		const query = querystring.stringify({
			id: id,
			key: process.env.YOUTUBE_API_KEY,
			part: ['snippet', 'id'],
		});
		const res: AxiosResponse<YoutubeResponse> = await axios.get(
			'https://youtube.googleapis.com/youtube/v3/playlists?' + query,
			{ timeout: 10000 }
		);
		console.log(res.data);
		console.log(res.data.items[0].snippet);
		const data: VideoData = {
			host: 'youtube-playlist',
			id: res.data.items[0].id,
			title: res.data.items[0].snippet.title,
			channelId: res.data.items[0].snippet.channelId,
			channelName: res.data.items[0].snippet.channelTitle,
			iFrameSrcId: res.data.items[0].id,
			livestreamChat: res.data.items[0].snippet.liveBroadcastContent === 'live',
		};
		return NextResponse.json(data, { status: 200 });
	} catch (error: unknown) {
		return fetchErrorFormat(error);
	}
}
