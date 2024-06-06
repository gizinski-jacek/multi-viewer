import { VideoData } from '@/app/libs/types';
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
		// ! Having issues verifying email on Vimeo which prevents me from creating
		// ! client_id and client_secret keys for use in authentication.
		// const resAuth: AxiosResponse<any> = await axios.get(
		// 	'https://api.vimeo.com/oauth/authorize/client',
		// 	{
		// 		headers: {
		// 			Authorization: 'Bearer ' + resAuth.data.access_token,
		// 			'Client-Id': process.env.VIMEO_CLIENT_ID,
		// 		},
		// 		timeout: 10000,
		// 	}
		// );
		// const res: AxiosResponse<VimeoVideo> = await axios.get(
		// 	'https://api.vimeo.com/videos/' + id + '?fields=uri,name'
		// );
		// const data: VideoData = {
		// 	host: 'vimeo',
		// 	id: res.data.uri.replace('/videos/', ''),
		// 	channelId: null,
		// 	name: res.data.name,
		// 	iFrameSrcId: res.data.uri.replace('/videos/', ''),
		// 	livestreamChat: false,
		// };
		//
		// ! Returning dummy info with user provided id to render video.
		const data: VideoData = {
			host: 'vimeo',
			id: id,
			channelId: 'null',
			name: 'res.data.name',
			iFrameSrcId: id,
			livestreamChat: false,
		};
		return NextResponse.json(data, { status: 200 });
	} catch (error: any) {
		console.log(error.response);
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
