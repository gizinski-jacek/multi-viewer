/**
 * @jest-environment jsdom
 */

import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HLSWrapper from '@/components/wrappers/HLSWrapper';
import IFrameWrapper from '@/components/wrappers/IFrameWrapper';
import VideoWrapper from '@/components/wrappers/VideoWrapper';
import { VideoData } from '@/libs/types';
import stylesVideoWrapper from './VideoWrapper.module.scss';
import { createIFrameVideoSource } from '@/libs/utils';

interface Props {
	video: VideoData;
	removeVideo: (video: VideoData) => void;
}

jest.mock('@/components/wrappers/VideoWrapper', () => {
	const VideoWrapper = ({ video, removeVideo }: Props) => (
		<div className={stylesVideoWrapper.video} data-testid='VideoWrapper'>
			<button
				className={`${stylesVideoWrapper['remove-video']} btn btn-danger`}
				type='button'
				onClick={() => removeVideo(video)}
				data-testid='remove-video'
			></button>
			{video.host === 'm3u8' ? (
				<HLSWrapper url={video.id} />
			) : (
				<IFrameWrapper
					src={createIFrameVideoSource(video.host, video.id)}
					title={video.host && `${video.host} video player`}
				/>
			)}
		</div>
	);
	return VideoWrapper;
});

const videoData: VideoData = {
	host: 'youtube',
	id: '9ai3kgu5',
	title: 'Test title',
	channelId: 'y45y5vs1',
	channelName: 'Test name',
	livestreamChat: false,
	thumbnailUrl: null,
};

describe('wrappers', () => {
	describe('HSLWrapper component', () => {
		afterEach(cleanup);
		it('renders video element with default title', () => {
			render(<HLSWrapper url='test' />);
			const video = screen.getByTitle('Stream wrapper');
			expect(video).toHaveProperty('title', 'Stream wrapper');
			expect(video).toBeInTheDocument();
			expect(video).toMatchSnapshot();
		});

		it('renders video element with src property pointing to host url address', () => {
			render(<HLSWrapper url='' />);
			const video = screen.getByTitle('Stream wrapper');
			expect(video).toHaveProperty('src', window.location.origin + '/');
		});

		it('renders video element with src property pointing to provided url', () => {
			const url =
				'https://www.google.com/hls/MjAyNC0xMC0zMFQxMzozMjowMS42NTdac291cHRlbGU/index.m3u8';
			render(<HLSWrapper url={url} />);
			const video = screen.getByTitle('Stream wrapper');
			expect(video).toHaveProperty('src', url);
		});
	});

	describe('IFrameWrapper component', () => {
		afterEach(cleanup);
		it('renders iframe element with default title', () => {
			render(<IFrameWrapper src='test' />);
			const iframe = screen.getByTitle('IFrame wrapper');
			expect(iframe).toHaveProperty('title', 'IFrame wrapper');
			expect(iframe).toBeInTheDocument();
			expect(iframe).toMatchSnapshot();
		});

		it('renders iframe element with custom title and src property pointing to host url address', () => {
			render(<IFrameWrapper src='' title={'Testing unit'} />);
			const iframe = screen.getByTitle('Testing unit');
			expect(iframe).toHaveProperty('title', 'Testing unit');
			expect(iframe).toHaveProperty('src', window.location.origin + '/');
		});

		it('renders iframe element with default title and src property pointing to host url address', () => {
			const src =
				'https://www.google.com/hls/MjAyNC0xMC0zMFQxMzozMjowMS42NTdac291cHRlbGU/index.m3u8';
			render(<IFrameWrapper src={src} />);
			const iframe = screen.getByTitle('IFrame wrapper');
			expect(iframe).toHaveProperty('title', 'IFrame wrapper');
			expect(iframe).toHaveProperty('src', src);
		});
	});

	describe('VideoWrapper component', () => {
		afterEach(cleanup);
		const handleRemove = jest.fn((data) => data);
		const user = userEvent.setup();

		it('renders mocked VideoWrapper component with "video" class with iframe element as last child using mock data', () => {
			render(<VideoWrapper video={videoData} removeVideo={handleRemove} />);
			const video = screen.getByTestId('VideoWrapper');
			expect(video).toBeInTheDocument();
			expect(video).toMatchSnapshot();
			expect(video).toHaveClass('video');
			expect(video.lastChild).toHaveProperty(
				'src',
				createIFrameVideoSource(videoData.host, videoData.id)
			);
		});

		it('renders mocked VideoWrapper component with video element using m3u8 as host service using mock data', () => {
			render(
				<VideoWrapper
					video={{ ...videoData, host: 'm3u8' }}
					removeVideo={handleRemove}
				/>
			);
			const video = screen.getByTestId('VideoWrapper');
			expect(video.lastChild).toHaveProperty(
				'src',
				'http://localhost/' + videoData.id
			);
		});

		it('remove video button renders as first child of VideoWrapper, has click property, and properly registers clicks', () => {
			render(<VideoWrapper video={videoData} removeVideo={handleRemove} />);
			const video = screen.getByTestId('VideoWrapper');
			expect(video.firstChild).toHaveClass('remove-video');
			expect(video.lastChild).toHaveProperty(
				'src',
				createIFrameVideoSource(videoData.host, videoData.id)
			);
			const removeVideo = screen.getByTestId('remove-video');
			expect(removeVideo).toHaveProperty('click');
			expect(handleRemove).toHaveBeenCalledTimes(0);
			user.click(handleRemove(videoData));
			expect(handleRemove).toHaveBeenCalledTimes(1);
		});

		it('remove video function returns mocked data', () => {
			expect(handleRemove).not.toHaveBeenCalled();
			expect(handleRemove(videoData)).toMatchObject(videoData);
			expect(handleRemove).toHaveBeenLastCalledWith(videoData);
		});
	});
});
