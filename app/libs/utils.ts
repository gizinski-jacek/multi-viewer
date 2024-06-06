import axios, { AxiosError, AxiosResponse } from 'axios';
import { Hosts, VideoData } from './types';

export const hostExtractURIList: { [key: string]: string } = {
	youtube: 'https://www.youtube.com/watch?v=',
	twitch: 'https://www.twitch.tv/',
	'twitch-vod': 'https://www.twitch.tv/videos/',
	dailymotion: 'https://www.dailymotion.com/video/',
	vimeo: 'https://vimeo.com/',
};

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
	} catch (error: any) {
		if (error instanceof Response) {
			throw error.statusText || 'Unknown error';
		} else if (error instanceof AxiosError) {
			throw error.message || 'Unknown error';
		} else {
			throw (error as Error).message || 'Unknown error';
		}
	}
}

export function createIFrameVideoSource(host: Hosts, id: string): string {
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
		case 'twitch':
			return `https://player.twitch.tv/?channel=${id}&parent=${embed_domain}`;
		case 'twitch-vod':
			return `https://player.twitch.tv/?video=${id}&parent=${embed_domain}`;
		case 'dailymotion':
			return `https://www.dailymotion.com/embed/video/${id}`;
		case 'vimeo':
			return `https://player.vimeo.com/video/${id}`;
		default:
			throw new Error('Unsupported host or incorrect ID');
	}
}

export function createIFrameChatSource(host: Hosts, id: string): string {
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
