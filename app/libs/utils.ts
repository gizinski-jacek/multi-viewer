import axios, { AxiosError, AxiosResponse } from 'axios';
import { VideoData } from './types';

export const sourceExtractURIList: { [key: string]: string } = {
	youtube: 'https://www.youtube.com/watch?v=',
	twitch: 'https://www.twitch.tv/',
};

export async function getVideoData(
	source: string,
	id: string
): Promise<VideoData> {
	try {
		if (!source) {
			throw new Error('Select source');
		}
		if (!id) {
			throw new Error('Provide link/Id');
		}
		const res: AxiosResponse<VideoData> = await axios.get(
			`/api/${source}?id=${id}`,
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

export function createIFrameVideoSource(source: string, id: string): string {
	const embed_domain =
		process.env.NEXT_PUBLIC_NODE_ENV === 'production'
			? process.env.NEXT_PUBLIC_EMBED_DOMAIN
			: process.env.NEXT_PUBLIC_EMBED_DOMAIN_DEV;
	if (!embed_domain) {
		throw new Error('Environment setup error');
	}
	switch (source) {
		case 'youtube':
			return `https://www.youtube-nocookie.com/embed/${id}?si=KYaMHED2Xcwqpct0`;
		case 'twitch':
			return `https://player.twitch.tv/?channel=${id}&parent=${embed_domain}`;
		default:
			throw new Error();
	}
}

export function createIFrameChatSource(source: string, id: string): string {
	const embed_domain =
		process.env.NEXT_PUBLIC_NODE_ENV === 'production'
			? process.env.NEXT_PUBLIC_EMBED_DOMAIN
			: process.env.NEXT_PUBLIC_EMBED_DOMAIN_DEV;
	if (!embed_domain) {
		throw new Error('Environment setup error');
	}
	switch (source) {
		case 'youtube':
			return `https://www.youtube.com/live_chat?v=${id}&embed_domain=${embed_domain}`;
		case 'twitch':
			return `https://www.twitch.tv/embed/${id}/chat?parent=${embed_domain}`;
		default:
			throw new Error();
	}
}
