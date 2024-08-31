'use client';

import styles from './styles.module.scss';
import { CSSProperties, useCallback, useEffect, useState } from 'react';
import {
	createURLParams,
	extractVideoId,
	getDataFromParams,
	getVideoData,
} from '../libs/utils';
import Navbar from '../components/Navbar';
import { Hosts, VideoData } from '../libs/types';
import Loading from '../components/Loading';
import { NextResponse } from 'next/server';
import { useSearchParams } from 'next/navigation';
import Chat from '../components/Chat';
import Playlist from '../components/Playlist';
import VideoWrapper from '../components/wrappers/VideoWrapper';

export default function App() {
	const videoListParams = useSearchParams().get('list');
	const [fetching, setFetching] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [videoListData, setVideoListData] = useState<VideoData[]>([]);
	const [showChat, setShowChat] = useState<boolean>(false);
	const [activeChat, setActiveChat] = useState<VideoData | null>(null);
	const [gridColSize, setGridColSize] = useState<1 | 2>(1);
	const [showNavbar, setShowNavbar] = useState<boolean>(true);
	const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
	const [manualGridColSize, setManualGridColSize] = useState<'auto' | 1 | 2>(
		'auto'
	);

	useEffect(() => {
		(async () => {
			if (!videoListParams) return;
			const videoData = await getDataFromParams(videoListParams);
			setVideoListData(videoData);
		})();
	}, [videoListParams]);

	async function handleAddVideo(host: Hosts, userInput: string) {
		try {
			if (fetching) return;
			dismissError();
			if (!host) {
				setError('Select video host');
				return;
			}
			if (!userInput) {
				setError('Provide video link or ID');
				return;
			}
			const id = extractVideoId(host, userInput);
			if (
				videoListData.find((video) => video.id === id && video.host === host)
			) {
				setError('Video already on the list');
				return;
			}
			setFetching(true);
			const data = await getVideoData(host, id);
			const newVideoDataState = [...videoListData, data];
			setVideoListData(newVideoDataState);
			const params = createURLParams(newVideoDataState);
			window.history.pushState(null, '', params);
			setFetching(false);
		} catch (error: unknown) {
			if (error instanceof NextResponse) {
				setError(
					error.status !== 500
						? error.statusText ||
								'Unknown fetching error. Make sure you selected correct source.'
						: 'Unknown fetching error. Make sure you selected correct source.'
				);
			} else {
				setError(
					'Unknown fetching error. Make sure you selected correct source.'
				);
			}
			setFetching(false);
		}
	}

	function handleRemoveVideo(video: VideoData) {
		if (!video) {
			setError('Error removing video');
			return;
		}
		const newVideoDataState = videoListData.filter((vid) =>
			vid.id === video.id ? (vid.host === video.host ? false : true) : true
		);
		setVideoListData(newVideoDataState);
		const newParams = createURLParams(newVideoDataState);
		window.history.pushState(null, '', newParams);
		if (activeChat?.id === video.id && activeChat.host === video.host) {
			setActiveChat(null);
			setShowChat(false);
		}
	}

	function handleReorderVideo(video: VideoData, index: number) {
		// ToDo: Find reason why videos moved to earlier index don't get rerendered while all others do.
		if (index < 0 || index >= videoListData.length) return;
		const newState = videoListData.filter((vid) =>
			vid.id === video.id ? (vid.host === video.host ? false : true) : true
		);
		newState.splice(index, 0, video);
		const newParams = createURLParams(newState);
		window.history.pushState(null, '', newParams);
		setVideoListData(newState);
	}

	function handleChatToggle() {
		if (showPlaylist) {
			setShowPlaylist(false);
			setShowChat(true);
		} else {
			if (!showChat && !activeChat) {
				const chat = videoListData.find((video) => video.livestreamChat);
				if (!chat) return;
				setActiveChat(chat);
			}
			setShowChat((prevState) => !prevState);
		}
	}

	function handleChangeChat(data: VideoData) {
		if (!data) {
			setError('Provide Id');
			return;
		}
		setActiveChat(data);
	}

	const watchResize = useCallback(() => {
		if (manualGridColSize !== 'auto') return;
		if (window.innerWidth < 1000) {
			setGridColSize(1);
		}
		if (window.innerWidth >= 1000 && window.innerWidth < 1300) {
			if (videoListData.length > 1) {
				if (showChat) {
					setGridColSize(1);
				} else {
					setGridColSize(2);
				}
			} else {
				setGridColSize(1);
			}
		}
		if (window.innerWidth >= 1300) {
			if (videoListData.length > 1) {
				setGridColSize(2);
			} else {
				setGridColSize(1);
			}
		}
	}, [videoListData, showChat, manualGridColSize]);

	useEffect(() => {
		watchResize();
	}, [videoListData, showChat, watchResize]);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		window.addEventListener('resize', watchResize);

		return () => window.removeEventListener('resize', watchResize);
	}, [watchResize]);

	function dismissError() {
		setError(null);
	}

	function toggleNavbarVisibility() {
		setShowNavbar((prevState) => !prevState);
	}

	function handlePlaylistToggle() {
		setShowPlaylist((prevState) => !prevState);
	}

	function handleLayoutToggle() {
		if (manualGridColSize === 'auto') {
			setManualGridColSize(1);
		} else if (manualGridColSize === 1) {
			setManualGridColSize(2);
		} else if (manualGridColSize === 2) {
			setManualGridColSize('auto');
		}
	}

	return (
		<div className={styles.app}>
			<Navbar
				addVideo={handleAddVideo}
				toggleChat={handleChatToggle}
				activeChat={!!videoListData.find((video) => video.livestreamChat)}
				showNavbar={showNavbar}
				toggleNavbar={toggleNavbarVisibility}
				togglePlaylist={handlePlaylistToggle}
				disablePlaylist={!videoListData.length}
				toggleLayout={handleLayoutToggle}
				manualGridColSize={manualGridColSize}
			/>
			{error && !!videoListData.length && (
				<div className={styles['error-absolute']} onClick={dismissError}>
					{error}
				</div>
			)}
			<main
				className={`${
					styles['main']
				} flex-fill d-flex flex-column flex-md-row ${
					showNavbar ? `p-3 gap-2 ${styles['navbar-on']}` : 'p-0 gap-1'
				}`}
			>
				<div
					className={`${styles['video-list']} ${
						manualGridColSize === 'auto'
							? styles[`grid-size-${gridColSize}`]
							: styles[`grid-size-${manualGridColSize}`]
					} ${showNavbar ? 'gap-2' : 'gap-1'}`}
				>
					{videoListData.map((video) => (
						<VideoWrapper
							key={video.id}
							video={video}
							removeVideo={handleRemoveVideo}
						/>
					))}
					{fetching && (
						<div
							className='position-absolute top-0 start-0 end-0 bottom-0 bg-dark'
							style={{ '--bs-bg-opacity': '0.75' } as CSSProperties}
						>
							<Loading
								style={{
									position: 'absolute',
									left: '50%',
									top: '50%',
									transform: 'translate(-50%, -50%)',
								}}
							/>
						</div>
					)}
					{error && !videoListData.length && (
						<div className={styles.error} onClick={dismissError}>
							{error}
						</div>
					)}
				</div>
				{(showChat || showPlaylist) && (
					<div className={styles.sidebar}>
						{showChat && (
							<Chat
								videoData={videoListData}
								activeChat={activeChat}
								changeChat={handleChangeChat}
							/>
						)}
						{showPlaylist && (
							<Playlist
								navbarVisible={showNavbar}
								playlist={videoListData}
								removeVideo={handleRemoveVideo}
								reorderVideo={handleReorderVideo}
							/>
						)}
					</div>
				)}
			</main>
		</div>
	);
}
