export type Sources = 'youtube' | 'twitch' | 'twitch-vod';

export interface VideoData {
	source: Sources;
	id: string;
	channelId: string;
	name: string;
	iFrameSrcId: string;
	livestreamChat: boolean;
}

export interface YoutubeResponse {
	kind: string;
	etag: string;
	nextPageToken: string;
	prevPageToken: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
	items: YoutubeVideo[];
}

export interface YoutubeVideo {
	kind: string;
	etag: string;
	id: string;
	snippet: {
		publishedAt: string;
		channelId: string;
		title: string;
		description: string;
		thumbnails: {
			[key: string]: {
				url: string;
				width: number;
				height: number;
			};
		};
		channelTitle: string;
		tags: string[];
		categoryId: string;
		liveBroadcastContent: string;
		defaultLanguage: string;
		localized: {
			title: string;
			description: string;
		};
		defaultAudioLanguage: string;
	};
}

export interface TwitchAuth {
	access_token: string;
	expires_in: number;
	token_type: string;
}

export interface TwitchStream {
	data: [
		{
			id: string;
			login: string;
			display_name: string;
			type: string;
			broadcaster_type: string;
			description: string;
			profile_image_url: string;
			offline_image_url: string;
			view_count: number;
			email: string;
			created_at: string;
		}
	];
}
export interface TwitchVOD {
	data: [
		{
			id: string;
			stream_id: null;
			user_id: string;
			user_login: string;
			user_name: string;
			title: string;
			description: string;
			created_at: string;
			published_at: string;
			url: string;
			thumbnail_url: string;
			viewable: string;
			view_count: number;
			language: string;
			type: string;
			duration: string;
			muted_segments: {
				duration: number;
				offset: number;
			}[];
		}
	];
	pagination: {};
}
