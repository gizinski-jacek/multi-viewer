import { VideoData } from '@/libs/types';
import { formatFetchError } from '@/libs/utils';
import axios from 'axios';
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
		// Checks whether the link is valid
		await axios.get(id);
		const data: VideoData = {
			host: 'm3u8',
			id: id,
			title: 'm3u8 stream',
			channelId: 'm3u8 stream',
			channelName: 'm3u8 stream',
			livestreamChat: false,
			thumbnailUrl: null,
		};
		return NextResponse.json(data, { status: 200 });
	} catch (error: unknown) {
		return formatFetchError(error);
	}
}
