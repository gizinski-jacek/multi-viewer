import axios, { AxiosError, AxiosResponse } from 'axios';
import { Hosts, VideoData } from './types';

export function extractVideoId(host: Hosts, string: string): string {
	const str =
		string[string.length - 1] === '/'
			? string.slice(0, string.length - 1)
			: string;
	if (host === 'youtube') {
		const id = str
			.replace('https://youtu.be/', '')
			.replace('https://www.youtube.com/watch?v=', '');
		return id.slice(0, id.indexOf('?si='));
	}
	if (host === 'youtube-playlist') {
		const id = str.slice(str.indexOf('?list=') + 6);
		return id.slice(0, id.indexOf('?si='));
	}
	if (host === 'twitch') {
		return str.slice(str.lastIndexOf('/') + 1);
	}
	if (host === 'twitch-vod') {
		return str.slice(str.lastIndexOf('/') + 1);
	}
	if (host === 'dailymotion') {
		return str.slice(str.lastIndexOf('/') + 1);
	}
	if (host === 'dailymotion-playlist') {
		return str.slice(str.lastIndexOf('/') + 1);
	}
	if (host === 'vimeo') {
		return str.slice(str.lastIndexOf('/') + 1);
	}
	throw new Error('Unsupported host or incorrect ID');
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
