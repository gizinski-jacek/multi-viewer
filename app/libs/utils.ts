import axios, { AxiosError, AxiosResponse } from 'axios';
import { Hosts, VideoData } from './types';
import { NextResponse } from 'next/server';

export function extractVideoId(host: Hosts, string: string): string {
	if (!host) throw new Error('Select video host');
	const str =
		string[string.length - 1] === '/'
			? string.slice(0, string.length - 1)
			: string;
	switch (host) {
		case 'youtube':
			let idYT = str
				.replace('https://youtu.be/', '')
				.replace('https://www.youtube.com/watch?v=', '')
				.replace('https://www.youtube.com/live/', '');
			if (idYT.indexOf('&list=') > 1) {
				idYT = idYT.slice(0, idYT.indexOf('&list='));
			}
			if (idYT.indexOf('?si=') > 1) {
				idYT = idYT.slice(0, idYT.indexOf('?si='));
			}
			return idYT;
		case 'youtube-playlist':
			let idYTP = str
				.replace('https://youtube.com/playlist?list=', '')
				.replace('https://www.youtube.com/playlist?list=', '');
			if (idYTP.includes('?si=')) {
				idYTP = idYTP.slice(0, idYTP.indexOf('?si='));
			}
			return idYTP;
		case 'twitch':
		case 'twitch-vod':
		case 'dailymotion':
		case 'dailymotion-playlist':
		case 'vimeo':
			return str.slice(str.lastIndexOf('/') + 1);
		default:
			throw new Error('Unsupported host or incorrect ID');
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
			{ error: 'Unknown server error' },
			{ status: 500, statusText: 'Unknown server error' }
		);
	}
}

export function createURLParams(data: VideoData[]): string {
	return (
		'?list=' +
		encodeURIComponent(data.map((v) => v.host + '+' + v.id).join('--'))
	);
}

export async function getDataFromParams(string: string): Promise<VideoData[]> {
	const array = decodeURIComponent(string).split('--');
	const results = await Promise.allSettled(
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
	);
	const data = results.map((res) =>
		res.status === 'fulfilled' ? (res.value as VideoData) : null
	);
	return data.filter((r) => r !== null);
}
