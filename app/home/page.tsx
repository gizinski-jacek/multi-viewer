'use client';

import styles from './styles.module.scss';
import { CSSProperties, useCallback, useEffect, useState } from 'react';
import {
	createIFrameVideoSource,
	createURLParams,
	extractVideoId,
	getDataFromParams,
	getVideoData,
} from '../libs/utils';
import { IFrameWrapper } from '../components/IFrameWrapper';
import Navbar from '../components/Navbar';
import { Hosts, VideoData } from '../libs/types';
import Loading from '../components/Loading';
import { NextResponse } from 'next/server';
import { useSearchParams } from 'next/navigation';
import Chat from '../components/Chat';
import Playlist from '../components/Playlist';

export default function App() {
	const videoList = useSearchParams().get('list');
	const [fetching, setFetching] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [videoData, setVideoData] = useState<VideoData[]>([]);
	const [showChat, setShowChat] = useState<boolean>(false);
	const [activeChat, setActiveChat] = useState<VideoData | null>(null);
	const [gridColSize, setGridColSize] = useState<number>(1);
	const [showNavbar, setShowNavbar] = useState<boolean>(true);
	const [showPlaylist, setShowPlaylist] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			if (!videoList) return;
			const videoData = await getDataFromParams(videoList);
			setVideoData(videoData);
		})();
	}, [videoList]);

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
			if (videoData.find((vid) => vid.id === id && vid.host === host)) {
				setError('Video already on the list');
				return;
			}
			setFetching(true);
			const data = await getVideoData(host, id);
			const newVideoDataState = [...videoData, data];
			setVideoData(newVideoDataState);
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
		const newVideoDataState = videoData.filter((v) =>
			v.id === video.id ? (v.host === video.host ? false : true) : true
		);
		setVideoData(newVideoDataState);
		const newParams = createURLParams(newVideoDataState);
		window.history.pushState(null, '', newParams);
		if (activeChat?.id === video.id && activeChat.host === video.host) {
			setActiveChat(null);
			setShowChat(false);
		}
	}

	function handleChatToggle() {
		if (showPlaylist) {
			setShowPlaylist(false);
		} else {
			if (!showChat && !activeChat) {
				const chat = videoData.find((v) => v.livestreamChat);
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
		if (window.innerWidth < 1000) {
			setGridColSize(1);
		}
		if (window.innerWidth >= 1000 && window.innerWidth < 1300) {
			if (videoData.length > 1) {
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
			if (videoData.length > 1) {
				setGridColSize(2);
			} else {
				setGridColSize(1);
			}
		}
	}, [videoData, showChat]);

	useEffect(() => {
		watchResize();
	}, [videoData, showChat, watchResize]);

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

	return (
		<div className={styles.app}>
			<Navbar
				addVideo={handleAddVideo}
				toggleChat={handleChatToggle}
				activeChat={!!videoData.find((v) => v.livestreamChat)}
				showNavbar={showNavbar}
				toggleNavbar={toggleNavbarVisibility}
				togglePlaylist={handlePlaylistToggle}
				disablePlaylist={!videoData.length}
			/>
			{error && !!videoData.length && (
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
						styles[`grid-size-${gridColSize}`]
					} ${showNavbar ? 'gap-2' : 'gap-1'}`}
				>
					{videoData.map((vid) => (
						<div key={vid.id} className={styles.video}>
							<div
								className={`${styles['close-video']} btn btn-warning p-0`}
								onClick={() => handleRemoveVideo(vid)}
							>
								Close
							</div>
							<IFrameWrapper
								src={createIFrameVideoSource(vid.host, vid.iFrameSrcId)}
							/>
						</div>
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
					{error && !videoData.length && (
						<div className={styles.error} onClick={dismissError}>
							{error}
						</div>
					)}
				</div>
				<div className={styles.sidebar}>
					{showChat && (
						<Chat
							videoData={videoData}
							activeChat={activeChat}
							changeChat={handleChangeChat}
						/>
					)}
					{showPlaylist && (
						<Playlist navbarVisible={showNavbar} playlist={videoData} />
					)}
				</div>
			</main>
		</div>
	);
}
