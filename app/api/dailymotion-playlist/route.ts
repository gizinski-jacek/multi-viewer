import { DailymotionPlaylist, VideoData } from '@/app/libs/types';
import { fetchErrorFormat } from '@/app/libs/utils';
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
		const fields = ['id', 'name', 'owner.id', 'owner.username'];
		const res: AxiosResponse<DailymotionPlaylist> = await axios.get(
			'https://api.dailymotion.com/playlist/' +
				id +
				'?fields=' +
				fields.join(',')
		);
		const data: VideoData = {
			host: 'dailymotion-playlist',
			id: res.data.id,
			title: res.data.name,
			channelId: res.data['owner.id'],
			channelName: res.data['owner.username'],
			iFrameSrcId: res.data.id,
			livestreamChat: false,
		};
		return NextResponse.json(data, { status: 200 });
	} catch (error: any) {
		return fetchErrorFormat(error);
	}
}