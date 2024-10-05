import axios, { AxiosError, AxiosResponse } from 'axios';
import { Hosts, VideoData } from './types';
import { NextResponse } from 'next/server';

export function extractVideoId(
	host: Hosts,
	string: string
): string | undefined {
	const str =
		string[string.length - 1] === '/'
			? string.slice(0, string.length - 1)
			: string;
	switch (host) {
		case 'youtube':
			let idYT = str;
			if (idYT.includes('?si=')) {
				idYT = idYT.slice(0, idYT.indexOf('?si='));
			}
			if (idYT.includes('?v=')) {
				idYT = idYT.slice(idYT.indexOf('?v=') + 3);
			}
			if (idYT.includes('.be/')) {
				idYT = idYT.slice(idYT.indexOf('.be/') + 4);
			}
			if (idYT.includes('/live/')) {
				idYT = idYT.slice(idYT.indexOf('/live/') + 6);
			}
			return idYT;
		case 'youtube-playlist':
			let idYTP = str;
			if (idYTP.includes('?si=')) {
				idYTP = idYTP.slice(0, idYTP.indexOf('?si='));
			}
			if (idYTP.includes('?list=')) {
				idYTP = idYTP.slice(idYTP.indexOf('?list=') + 6);
			}
			if (idYTP.includes('&list=')) {
				idYTP = idYTP.slice(idYTP.indexOf('&list=') + 6);
			}
			return idYTP;
		case 'twitch-vod':
			let idTTVVod = str;
			if (idTTVVod.includes('/videos/')) {
				idTTVVod = idTTVVod.slice(str.indexOf('/videos/') + 8);
			}
			if (idTTVVod.includes('?')) {
				idTTVVod = idTTVVod.slice(0, idTTVVod.indexOf('?'));
			}
			return idTTVVod;
		case 'twitch':
		case 'dailymotion':
		case 'dailymotion-playlist':
		case 'vimeo':
			return str.slice(str.lastIndexOf('/') + 1);
		default:
			break;
	}
}

export async function getVideoData(
	host: Hosts,
	id: string
): Promise<VideoData> {
	try {
		if (!host) {
			throw new Error('Select video host');
		}
		if (!id) {
			throw new Error('Provide video link or ID');
		}
		const res: AxiosResponse<VideoData> = await axios.get(
			`/api/${host}?id=${id}`,
			{ timeout: 10000 }
		);
		return res.data;
	} catch (error: unknown) {
		throw formatFetchError(error);
	}
}

export function createIFrameVideoSource(host: Hosts, id: string): string {
	if (!host) throw new Error('Select video host');
	const embed_domain =
		process.env.NEXT_PUBLIC_NODE_ENV === 'production'
			? process.env.NEXT_PUBLIC_EMBED_DOMAIN
			: process.env.NEXT_PUBLIC_EMBED_DOMAIN_DEV;
	if (!embed_domain) {
		throw new Error('Environment setup error');
	}
	switch (host) {
		case 'youtube':
			return `https://www.youtube-nocookie.com/embed/${id}`;
		case 'youtube-playlist':
			return `https://www.youtube.com/embed/videoseries?list=${id}`;
		case 'twitch':
			return `https://player.twitch.tv/?channel=${id}&parent=${embed_domain}`;
		case 'twitch-vod':
			return `https://player.twitch.tv/?video=${id}&parent=${embed_domain}`;
		case 'dailymotion':
			return `https://www.dailymotion.com/embed/video/${id}`;
		case 'dailymotion-playlist':
			return `https://www.dailymotion.com/embed/playlist/${id}`;
		case 'vimeo':
			return `https://player.vimeo.com/video/${id}`;
		default:
			throw new Error('Unsupported host or incorrect ID');
	}
}

export function createIFrameChatSource(host: Hosts, id: string): string {
	if (!host) throw new Error('Select video host');
	const embed_domain =
		process.env.NEXT_PUBLIC_NODE_ENV === 'production'
			? process.env.NEXT_PUBLIC_EMBED_DOMAIN
			: process.env.NEXT_PUBLIC_EMBED_DOMAIN_DEV;
	if (!embed_domain) {
		throw new Error('Environment setup error');
	}
	switch (host) {
		case 'youtube':
			return `https://www.youtube.com/live_chat?v=${id}&embed_domain=${embed_domain}`;
		case 'twitch':
			return `https://www.twitch.tv/embed/${id}/chat?parent=${embed_domain}`;
		case 'twitch-vod':
			return `https://www.twitch.tv/embed/${id}/chat?parent=${embed_domain}`;
		default:
			throw new Error('Unsupported host or incorrect ID');
	}
}

export function formatFetchError(error: unknown): NextResponse<{
	error: string;
}> {
	if (error instanceof AxiosError) {
		return NextResponse.json(
			{ error: error.response?.data.error || 'Unknown server error' },
			{
				status: error.status || 500,
				statusText: error.response?.data.error || 'Unknown server error',
			}
		);
	} else {
		return NextResponse.json(
			{ error: (error as Error)?.message || 'Unknown server error' },
			{
				status: 500,
				statusText: (error as Error)?.message || 'Unknown server error',
			}
		);
	}
}

export function createURLParams(data: VideoData[]): string | undefined {
	if (data.length === 0) return;
	return (
		'?list=' +
		encodeURIComponent(
			data.map((video) => video.host + '+' + video.id).join('--')
		)
	);
}

export async function getDataFromParams(string: string): Promise<VideoData[]> {
	const array = decodeURIComponent(string).split('--');
	const results = (await Promise.allSettled(
		array.map(
			(param) =>
				new Promise(async (resolve, reject) => {
					try {
						const str = param.split('+');
						const data = await getVideoData(str[0] as Hosts, str[1]);
						resolve(data);
					} catch (error: any) {
						reject(formatFetchError(error));
					}
				})
		)
	)) as { status: 'fulfilled' | 'rejected'; value: VideoData }[];
	const data = results
		.filter((res) => res.status === 'fulfilled')
		.map((res) => res.value);

	return data;
}
