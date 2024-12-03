import { DailymotionVideo, VideoData } from '@/libs/types';
import { formatFetchError } from '@/libs/utils';
import axios, { AxiosResponse } from 'axios';
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
		const fields = ['id', 'title', 'owner.id', 'owner.username'];
		const res: AxiosResponse<DailymotionVideo> = await axios.get(
			'https://api.dailymotion.com/video/' + id + '?fields=' + fields.join(',')
		);
		const data: VideoData = {
			host: 'dailymotion',
			id: res.data.id,
			title: res.data.title,
			channelId: res.data['owner.id'],
			channelName: res.data['owner.username'],
			livestreamChat: false,
			thumbnailUrl: null,
		};
		return NextResponse.json(data, { status: 200 });
	} catch (error: unknown) {
		return formatFetchError(error);
	}
}
