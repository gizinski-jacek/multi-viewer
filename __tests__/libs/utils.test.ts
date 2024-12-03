/**
 * @jest-environment jsdom
 */

import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();
import {
	capitalizeWords,
	createIFrameChatSource,
	createIFrameVideoSource,
	createURLParams,
	extractVideoId,
	formatFetchError,
	getDataFromParams,
	getVideoData,
} from '@/libs/utils';
import { Hosts, VideoData } from '@/libs/types';
jest.mock('next/server');

const mockData: { host: string; url: string; id: string }[] = [
	{
		host: 'youtube',
		url: 'https://www.youtube.com/watch?v=T2sv8jXoP4s',
		id: 'T2sv8jXoP4s',
	},
	{
		host: 'youtube',
		url: 'https://youtu.be/T2sv8jXoP4s?si=XdetdHDQVD_EqpgJ',
		id: 'T2sv8jXoP4s',
	},
	{
		host: 'youtube',
		url: 'https://www.youtube.com/live/J2i0cZWCdq4?si=KYR1sH6iY8xLltrq',
		id: 'J2i0cZWCdq4',
	},
	{
		host: 'youtube-playlist',
		url: 'https://www.youtube.com/watch?v=T2sv8jXoP4s&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd?si=slTXxioCzcPtS0Og',
		id: 'PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd',
	},
	{
		host: 'youtube-playlist',
		url: 'https://youtube.com/playlist?list=PLbpi6ZahtOH4avZrVEm5N1XchyanEhzfz&si=slTXxioCzcPtS0Og',
		id: 'PLbpi6ZahtOH4avZrVEm5N1XchyanEhzfz',
	},
	{
		host: 'twitch',
		url: 'https://www.twitch.tv/fl0m',
		id: 'fl0m',
	},
	{
		host: 'twitch-vod',
		url: 'https://www.twitch.tv/videos/2310091843?filter=archives&sort=time',
		id: '2310091843',
	},
	{
		host: 'vimeo',
		url: 'https://vimeo.com/684758411',
		id: '684758411',
	},
	{
		host: 'dailymotion',
		url: 'https://www.dailymotion.com/video/x6vxybk',
		id: 'x6vxybk',
	},
	{
		host: 'dailymotion-playlist',
		url: 'https://www.dailymotion.com/playlist/x5r9sh',
		id: 'x5r9sh',
	},
	{
		host: 'm3u8',
		url: 'https://video-weaver.ams03.hls.ttvnw.net/v1/playlist/CoMGFFg6TXAcJjhP8rKfy5GY_YEi8xoYWRl3p6qtd6z3GHLxFkaX7KKaZ8vVbYxHcoK-ZVGMuChO0PAYpjaMlGk_5UbCarC31z6LtpuooPa5M5hVMi4PlyHtWJ_hWNcT1Hcv5TbvPosKlDdqYABpB8NvsmMR2hgei7MQz9LOeLB_iLCxX5IWTBa_QhX9EUt8ZHnqvP7A8DhIrmjnKmr1_ZrS5yrzVcww7UISdONtvFKQojQy_4g1_Nd7I6ZpRL3khOO-l5crp49qZP_Iuk4hpHGsQoy4iVgTxwbaVB9XDv44LDeCw3xepLCFMXRaKVpD1FhKa7UmH0xKya_1p0JOnIGFItHJNGwxRfzWnz03aHut-oTycPoBCohYjh6ktSr88YeiaNKnJlNFMqpsu94ZjVB0srAdyjs8UsUHfNEqUgSSoLHDz9qSfJ7BTIsyhgArnAaTSp1dKvZmTlasqMF2AUN0XqDtMFPxVGy8bJco2zxVtMAZ4oRWeKO9ewkKQlGWC_r18TUeL0brxEgtQDUk7sz57k3qfNcy-DP4LXtpX1TTg9lxXGLyMrgv0GNYwGfciYnY8350ypW9jBJqn3XPpqgJAL4B9Q-CxpdvoE1aziUB5-XIK857t8AXPlf5u8LdVQbbB481Pg7ciRRmEv5Za3Ho29sDGJ_N4J-UeV1gitnwfuu-snpqfiFuuh38pq8l2BLBa5u6FRUUjkLpPjRiK1amccY1btfItLLHmm6Jh0CVqGOCukBe_NAjznVNF5WWOPrPMlXyQXNPDzUA49TDU3KA70Q0GRy1eURSPgvkLoqz8QFz8jgkCL7Sdif6S5Ei3Vongzind5DaU48wQQrqyjRa1K4uxL8NmEEtHDzdvxNfYpjyy1XOfONTc8jcNkEhjVJ8TS1ArtBjWl0WQqn5Xl0UH9Bbi5sFzbAHFAtf1N19FpuVxmtdbRsvrrTbeh5XBG3lQC2cM40JHeGqWvqFiWmPO-bIV1ykb7XyU8Bo17OND1RqPt_b573C-iCdHEUDtz4dG1lGGgwEbGYQAzhxxbXbvFwgASoJZXUtd2VzdC0yMIEL.m3u8',
		id: 'x6vxybk',
	},
	{
		host: 'null',
		url: 'https://video-weaver.ams03.hls.ttvnw.net/v1/playlist/CoMGFFg6TXAcJjhP8rKfy5GY_YEi8xoYWRl3p6qtd6z3GHLxFkaX7KKaZ8vVbYxHcoK-ZVGMuChO0PAYpjaMlGk_5UbCarC31z6LtpuooPa5M5hVMi4PlyHtWJ_hWNcT1Hcv5TbvPosKlDdqYABpB8NvsmMR2hgei7MQz9LOeLB_iLCxX5IWTBa_QhX9EUt8ZHnqvP7A8DhIrmjnKmr1_ZrS5yrzVcww7UISdONtvFKQojQy_4g1_Nd7I6ZpRL3khOO-l5crp49qZP_Iuk4hpHGsQoy4iVgTxwbaVB9XDv44LDeCw3xepLCFMXRaKVpD1FhKa7UmH0xKya_1p0JOnIGFItHJNGwxRfzWnz03aHut-oTycPoBCohYjh6ktSr88YeiaNKnJlNFMqpsu94ZjVB0srAdyjs8UsUHfNEqUgSSoLHDz9qSfJ7BTIsyhgArnAaTSp1dKvZmTlasqMF2AUN0XqDtMFPxVGy8bJco2zxVtMAZ4oRWeKO9ewkKQlGWC_r18TUeL0brxEgtQDUk7sz57k3qfNcy-DP4LXtpX1TTg9lxXGLyMrgv0GNYwGfciYnY8350ypW9jBJqn3XPpqgJAL4B9Q-CxpdvoE1aziUB5-XIK857t8AXPlf5u8LdVQbbB481Pg7ciRRmEv5Za3Ho29sDGJ_N4J-UeV1gitnwfuu-snpqfiFuuh38pq8l2BLBa5u6FRUUjkLpPjRiK1amccY1btfItLLHmm6Jh0CVqGOCukBe_NAjznVNF5WWOPrPMlXyQXNPDzUA49TDU3KA70Q0GRy1eURSPgvkLoqz8QFz8jgkCL7Sdif6S5Ei3Vongzind5DaU48wQQrqyjRa1K4uxL8NmEEtHDzdvxNfYpjyy1XOfONTc8jcNkEhjVJ8TS1ArtBjWl0WQqn5Xl0UH9Bbi5sFzbAHFAtf1N19FpuVxmtdbRsvrrTbeh5XBG3lQC2cM40JHeGqWvqFiWmPO-bIV1ykb7XyU8Bo17OND1RqPt_b573C-iCdHEUDtz4dG1lGGgwEbGYQAzhxxbXbvFwgASoJZXUtd2VzdC0yMIEL.m3u8',
		id: 'https://video-weaver.ams03.hls.ttvnw.net/v1/playlist/CoMGFFg6TXAcJjhP8rKfy5GY_YEi8xoYWRl3p6qtd6z3GHLxFkaX7KKaZ8vVbYxHcoK-ZVGMuChO0PAYpjaMlGk_5UbCarC31z6LtpuooPa5M5hVMi4PlyHtWJ_hWNcT1Hcv5TbvPosKlDdqYABpB8NvsmMR2hgei7MQz9LOeLB_iLCxX5IWTBa_QhX9EUt8ZHnqvP7A8DhIrmjnKmr1_ZrS5yrzVcww7UISdONtvFKQojQy_4g1_Nd7I6ZpRL3khOO-l5crp49qZP_Iuk4hpHGsQoy4iVgTxwbaVB9XDv44LDeCw3xepLCFMXRaKVpD1FhKa7UmH0xKya_1p0JOnIGFItHJNGwxRfzWnz03aHut-oTycPoBCohYjh6ktSr88YeiaNKnJlNFMqpsu94ZjVB0srAdyjs8UsUHfNEqUgSSoLHDz9qSfJ7BTIsyhgArnAaTSp1dKvZmTlasqMF2AUN0XqDtMFPxVGy8bJco2zxVtMAZ4oRWeKO9ewkKQlGWC_r18TUeL0brxEgtQDUk7sz57k3qfNcy-DP4LXtpX1TTg9lxXGLyMrgv0GNYwGfciYnY8350ypW9jBJqn3XPpqgJAL4B9Q-CxpdvoE1aziUB5-XIK857t8AXPlf5u8LdVQbbB481Pg7ciRRmEv5Za3Ho29sDGJ_N4J-UeV1gitnwfuu-snpqfiFuuh38pq8l2BLBa5u6FRUUjkLpPjRiK1amccY1btfItLLHmm6Jh0CVqGOCukBe_NAjznVNF5WWOPrPMlXyQXNPDzUA49TDU3KA70Q0GRy1eURSPgvkLoqz8QFz8jgkCL7Sdif6S5Ei3Vongzind5DaU48wQQrqyjRa1K4uxL8NmEEtHDzdvxNfYpjyy1XOfONTc8jcNkEhjVJ8TS1ArtBjWl0WQqn5Xl0UH9Bbi5sFzbAHFAtf1N19FpuVxmtdbRsvrrTbeh5XBG3lQC2cM40JHeGqWvqFiWmPO-bIV1ykb7XyU8Bo17OND1RqPt_b573C-iCdHEUDtz4dG1lGGgwEbGYQAzhxxbXbvFwgASoJZXUtd2VzdC0yMIEL.m3u8',
	},
	{
		host: 'dailymotion-playlist',
		url: 'https://www.youtube.com/watch?v=T2sv8jXoP4s',
		id: 'T2sv8jXoP4s',
	},
	{
		host: '',
		url: 'https://video-weaver.ams03.hls.ttvnw.net/v1/playlist/CoMGFFg6TXAcJjhP8rKfy5GY_YEi8xoYWRl3p6qtd6z3GHLxFkaX7KKaZ8vVbYxHcoK-ZVGMuChO0PAYpjaMlGk_5UbCarC31z6LtpuooPa5M5hVMi4PlyHtWJ_hWNcT1Hcv5TbvPosKlDdqYABpB8NvsmMR2hgei7MQz9LOeLB_iLCxX5IWTBa_QhX9EUt8ZHnqvP7A8DhIrmjnKmr1_ZrS5yrzVcww7UISdONtvFKQojQy_4g1_Nd7I6ZpRL3khOO-l5crp49qZP_Iuk4hpHGsQoy4iVgTxwbaVB9XDv44LDeCw3xepLCFMXRaKVpD1FhKa7UmH0xKya_1p0JOnIGFItHJNGwxRfzWnz03aHut-oTycPoBCohYjh6ktSr88YeiaNKnJlNFMqpsu94ZjVB0srAdyjs8UsUHfNEqUgSSoLHDz9qSfJ7BTIsyhgArnAaTSp1dKvZmTlasqMF2AUN0XqDtMFPxVGy8bJco2zxVtMAZ4oRWeKO9ewkKQlGWC_r18TUeL0brxEgtQDUk7sz57k3qfNcy-DP4LXtpX1TTg9lxXGLyMrgv0GNYwGfciYnY8350ypW9jBJqn3XPpqgJAL4B9Q-CxpdvoE1aziUB5-XIK857t8AXPlf5u8LdVQbbB481Pg7ciRRmEv5Za3Ho29sDGJ_N4J-UeV1gitnwfuu-snpqfiFuuh38pq8l2BLBa5u6FRUUjkLpPjRiK1amccY1btfItLLHmm6Jh0CVqGOCukBe_NAjznVNF5WWOPrPMlXyQXNPDzUA49TDU3KA70Q0GRy1eURSPgvkLoqz8QFz8jgkCL7Sdif6S5Ei3Vongzind5DaU48wQQrqyjRa1K4uxL8NmEEtHDzdvxNfYpjyy1XOfONTc8jcNkEhjVJ8TS1ArtBjWl0WQqn5Xl0UH9Bbi5sFzbAHFAtf1N19FpuVxmtdbRsvrrTbeh5XBG3lQC2cM40JHeGqWvqFiWmPO-bIV1ykb7XyU8Bo17OND1RqPt_b573C-iCdHEUDtz4dG1lGGgwEbGYQAzhxxbXbvFwgASoJZXUtd2VzdC0yMIEL.m3u8',
		id: '',
	},
];

const mockReturnData: VideoData = {
	host: 'youtube',
	id: 'T2sv8jXoP4s',
	title: 'React Testing Tutorial - 1 - Introduction',
	channelId: 'UC80PWRj_ZU8Zu0HSMNVwKWw',
	channelName: 'Codevolution',
	livestreamChat: false,
	thumbnailUrl: 'https://i.ytimg.com/vi/T2sv8jXoP4s/default.jpg',
};

jest.mock('../../app/libs/utils', () => ({
	...jest.requireActual('../../app/libs/utils'),
	getVideoData: jest.fn(
		async (host: string, id: string): Promise<VideoData> => {
			if (!host) {
				return Promise.reject('Select video host');
			}
			if (!id) {
				return Promise.reject('Provide video link or Id');
			}
			return Promise.resolve(mockReturnData);
		}
	),
	getDataFromParams: jest.fn((params: string): Promise<VideoData[]> => {
		const array = decodeURIComponent(params).split('&');
		const results = array.map((param) => {
			const str = param.split('+');
			return { ...mockReturnData, host: str[0] as Hosts, id: str[1] };
		});
		return Promise.resolve(results);
	}),
}));

describe('utils', () => {
	it('check if capitalization function works properly', () => {
		const string = capitalizeWords('capitalization function works properly');
		expect(string).not.toBe('capitalization function works properly');
		expect(string).not.toBe('CAPITALIZATION FUNCTION WORKS PROPERLY');
		expect(string).toBe('Capitalization Function Works Properly');
	});

	it('check if function properly extracts video Id using provided video host name and url', () => {
		const results: (string | undefined)[] = mockData.map((d) =>
			extractVideoId(d.host as Hosts, d.url)
		);
		expect(results[0]).toBe('T2sv8jXoP4s');
		expect(results[1]).toBe('T2sv8jXoP4s');
		expect(results[2]).toBe('J2i0cZWCdq4');
		expect(results[3]).toBe('PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd');
		expect(results[4]).toBe('PLbpi6ZahtOH4avZrVEm5N1XchyanEhzfz');
		expect(results[5]).toBe('fl0m');
		expect(results[6]).toBe('2310091843');
		expect(results[7]).toBe('684758411');
		expect(results[8]).toBe('x6vxybk');
		expect(results[9]).not.toBe('T2sv8jXoP4s');
		expect(results[10]).toBe(mockData[10].url);
		expect(results[11]).toBe(undefined);
		expect(results[12]).not.toBe('T2sv8jXoP4s');
		expect(results[13]).toBe(undefined);
	});

	it('fetching video data resolves and rejects properly', () => {
		expect(getVideoData('youtube', 'T2sv8jXoP4s')).resolves.toBe(
			mockReturnData
		);
		expect(getVideoData('', 'T2sv8jXoP4s')).rejects.toMatch(
			'Select video host'
		);
		expect(getVideoData(mockData[0].host as Hosts, '')).rejects.toMatch(
			'Provide video link or Id'
		);
	});

	it('creates correct IFrame video src with mock data', () => {
		const results: string[] = mockData.map((d) =>
			createIFrameVideoSource(d.host as Hosts, d.url)
		);
		expect(results[0]).toBe(
			'https://www.youtube-nocookie.com/embed/https://www.youtube.com/watch?v=T2sv8jXoP4s'
		);
		expect(results[2]).toBe(
			'https://www.youtube-nocookie.com/embed/https://www.youtube.com/live/J2i0cZWCdq4?si=KYR1sH6iY8xLltrq'
		);
		expect(results[4]).toBe(
			'https://www.youtube.com/embed/videoseries?list=https://youtube.com/playlist?list=PLbpi6ZahtOH4avZrVEm5N1XchyanEhzfz&si=slTXxioCzcPtS0Og'
		);
		expect(results[5]).toBe(
			'https://player.twitch.tv/?channel=https://www.twitch.tv/fl0m&parent=localhost'
		);
		expect(results[6]).toBe(
			'https://player.twitch.tv/?video=https://www.twitch.tv/videos/2310091843?filter=archives&sort=time&parent=localhost'
		);
		expect(results[7]).toBe(
			'https://player.vimeo.com/video/https://vimeo.com/684758411'
		);
		expect(results[8]).toBe(
			'https://www.dailymotion.com/embed/video/https://www.dailymotion.com/video/x6vxybk'
		);
		expect(results[9]).toBe(
			'https://www.dailymotion.com/embed/playlist/https://www.dailymotion.com/playlist/x5r9sh'
		);
		expect(results[10]).toBe('');
		expect(results[11]).toBe('');
		expect(results[12]).not.toBe(
			'https://www.youtube-nocookie.com/embed/https://www.youtube.com/watch?v=T2sv8jXoP4s'
		);
		expect(results[12]).not.toBe(
			'https://www.dailymotion.com/embed/video/https://www.dailymotion.com/video/x6vxybk'
		);
		expect(results[13]).toBe('');
	});

	it('creates correct IFrame chat src with mock data', () => {
		const results: string[] = mockData.map((d) =>
			createIFrameChatSource(d.host as Hosts, d.id)
		);
		expect(results[0]).toBe(
			'https://www.youtube.com/live_chat?v=T2sv8jXoP4s&embed_domain=localhost'
		);
		expect(results[5]).toBe(
			'https://www.twitch.tv/embed/fl0m/chat?parent=localhost'
		);
		expect(results[7]).toBe('');
	});

	// it('errors', () => {
	// 	const error = new Error('err');
	// 	const axiosError = new AxiosError('error');
	// 	expect(formatFetchError(error)).toBe({});
	// 	expect(formatFetchError(axiosError)).toBe({});
	// });

	it('creates correct URL params with mock data', () => {
		const params = createURLParams([mockReturnData]);
		expect(params).toBe('?list=youtube%2BT2sv8jXoP4s');
	});

	it('creates correct data from URL params', async () => {
		const results = await getDataFromParams(
			'youtube%2BT2sv8jXoP4s&youtube%2BT2sv8jXoP4s'
		);
		expect(results).toHaveLength(2);
		expect(results[0]).toMatchObject(mockReturnData);
		expect(results[0]).toMatchObject(results[1]);
	});
});
