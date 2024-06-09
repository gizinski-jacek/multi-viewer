import { VideoData, YoutubeResponse } from '@/app/libs/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
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
			'https://youtube.googleapis.com/youtube/v3/videos?' + query,
			{ timeout: 10000 }
		);
		const data: VideoData = {
			host: 'youtube',
			id: res.data.items[0].id,
			title: res.data.items[0].snippet.title,
			channelId: res.data.items[0].snippet.channelId,
			channelName: res.data.items[0].snippet.channelTitle,
			iFrameSrcId: res.data.items[0].id,
			livestreamChat: res.data.items[0].snippet.liveBroadcastContent === 'live',
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
