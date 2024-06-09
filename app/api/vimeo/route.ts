import { VideoData, VimeoVideo } from '@/app/libs/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(
	req: NextRequest
): Promise<NextResponse<VideoData | { error: string }>> {
	try {
		if (!process.env.VIMEO_ACCESS_TOKEN) {
			console.error('Provide VIMEO_ACCESS_TOKEN env variables');
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
		const res: AxiosResponse<VimeoVideo> = await axios.get(
			'https://api.vimeo.com/videos/' + id + '?fields=uri,name,type,user',
			{
				headers: {
					Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
				},
				timeout: 10000,
			}
		);
		const data: VideoData = {
			host: 'vimeo',
			id: res.data.uri.replace('/videos/', ''),
			title: res.data.name,
			channelId: res.data.user.uri.replace('/users/', ''),
			channelName: res.data.user.name,
			iFrameSrcId: res.data.uri.replace('/videos/', ''),
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
