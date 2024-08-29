export type Hosts =
	| 'youtube'
	| 'youtube-playlist'
	| 'twitch'
	| 'twitch-vod'
	| 'dailymotion'
	| 'dailymotion-playlist'
	| 'vimeo'
	| '';

export interface VideoData {
	host: Hosts;
	id: string;
	title: string | null;
	channelId: string | null;
	channelName: string;
	iFrameSrcId: string;
	livestreamChat: boolean;
	thumbnailUrl: string | null;
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
	data: {
		id: string;
		user_id: string;
		user_login: string;
		user_name: string;
		game_id: string;
		game_name: string;
		type: string;
		title: string;
		viewer_count: number;
		started_at: string;
		language: string;
		thumbnail_url: string;
		tag_ids: string[];
		tags: string[];
		is_mature: boolean;
	}[];
}
export interface TwitchVOD {
	data: {
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
	}[];
	pagination: {};
}

export interface DailymotionVideo {
	id: string;
	title: string;
	'owner.id': string;
	'owner.username': string;
}

export interface DailymotionPlaylist {
	id: string;
	name: string;
	'owner.id': string;
	'owner.username': string;
}

export interface VimeoVideo {
	uri: string;
	name: string;
	type: string;
	user: {
		uri: string;
		name: string;
		link: string;
	};
}
