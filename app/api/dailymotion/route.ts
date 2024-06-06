import { DailymotionVideo, VideoData } from '@/app/libs/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(
	req: NextRequest
): Promise<NextResponse<VideoData | { error: string }>> {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');
		if (!id)
			return NextResponse.json(
				{ error: 'Provide video link or Id' },
				{ status: 400 }
			);
		const res: AxiosResponse<DailymotionVideo> = await axios.get(
			'https://api.dailymotion.com/video/' + id
		);
		const data: VideoData = {
			host: 'dailymotion',
			id: res.data.id,
			channelId: res.data.owner,
			name: res.data.title,
			iFrameSrcId: res.data.id,
			livestreamChat: false,
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
