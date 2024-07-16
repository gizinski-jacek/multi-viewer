'use client';

import styles from './page.module.scss';
import { CSSProperties, useCallback, useEffect, useState } from 'react';
import {
	createIFrameChatSource,
	createIFrameVideoSource,
	extractVideoId,
	getVideoData,
} from './libs/utils';
import { IFrameWrapper } from './components/IFrameWrapper';
import Navbar from './components/Navbar';
import { Hosts, VideoData } from './libs/types';
import Loading from './components/Loading';

export default function App() {
	const [fetching, setFetching] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [videoData, setVideoData] = useState<VideoData[]>([]);
	const [openChat, setOpenChat] = useState<boolean>(false);
	const [activeChat, setActiveChat] = useState<VideoData | null>(null);
	const [gridColSize, setGridColSize] = useState<number>(1);

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
			setFetching(true);
			const id = extractVideoId(host, userInput);
			if (videoData.find((vid) => vid.id === id && vid.host === host)) {
				setFetching(false);
				return;
			}
			const data = await getVideoData(host, id);
			setVideoData((prevState) => [...prevState, data]);
			setFetching(false);
		} catch (error: any) {
			setError(typeof error === 'string' ? error : 'Unknown error');
			setFetching(false);
		}
	}

	function handleRemoveVideo(video: VideoData) {
		if (!video) {
			setError('Error removing video');
			return;
		}
		setVideoData((prevState) =>
			prevState.filter((v) =>
				v.id === video.id ? (v.host === video.host ? false : true) : true
			)
		);
		if (activeChat?.id === video.id && activeChat.host === video.host) {
			setActiveChat(null);
			setOpenChat(false);
		}
	}

	function handleChatToggle() {
		if (!openChat && !activeChat) {
			const chat = videoData.find((v) => v.livestreamChat);
			if (!chat) return;
			setActiveChat(chat);
		}
		setOpenChat((prevState) => !prevState);
	}

	function handleChangeChat(chat: VideoData) {
		if (!chat) {
			setError('Provide Id');
			return;
		}
		setActiveChat(chat);
	}

	const watchResize = useCallback(() => {
		if (window.innerWidth < 1000) {
			setGridColSize(1);
		}
		if (window.innerWidth >= 1000 && window.innerWidth < 1300) {
			if (videoData.length > 1) {
				if (openChat) {
					setGridColSize(1);
				} else {
					setGridColSize(2);
				}
			} else if (videoData.length === 1 && fetching) {
				if (openChat) {
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
	}, [videoData, openChat, fetching]);

	useEffect(() => {
		watchResize();
	}, [videoData, openChat, watchResize]);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		window.addEventListener('resize', watchResize);

		return () => window.removeEventListener('resize', watchResize);
	}, [watchResize]);

	function dismissError() {
		setError(null);
	}

	return (
		<main className={styles.app}>
			<Navbar
				addVideo={handleAddVideo}
				toggleChat={handleChatToggle}
				activeChat={!!videoData.find((v) => v.livestreamChat)}
			/>
			{error && !!videoData.length && (
				<div className={styles['error-absolute']} onClick={dismissError}>
					{error}
				</div>
			)}
			<div className='flex-fill d-flex flex-column flex-md-row p-3 gap-2'>
				<div
					className={`${styles['video-list']} ${
						styles[`grid-size-${gridColSize}`]
					}`}
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
				{openChat && (
					<div className={styles.chat}>
						{videoData.length ? (
							<>
								<div className={styles['chat-list']}>
									{videoData.map(
										(vid) =>
											vid.livestreamChat && (
												<div
													className={`btn p-0 px-1 text-nowrap overflow-hidden ${
														activeChat?.id === vid.id &&
														activeChat?.host === vid.host
															? 'btn-primary'
															: 'btn-secondary'
													}`}
													key={vid.id}
													onClick={() => handleChangeChat(vid)}
												>
													{vid.channelName}
												</div>
											)
									)}
								</div>
								<div className='flex-fill'>
									{activeChat && (
										<IFrameWrapper
											src={createIFrameChatSource(
												activeChat.host,
												activeChat.id
											)}
										/>
									)}
								</div>
							</>
						) : (
							<div className='m-auto'>Add a video to see the chat</div>
						)}
					</div>
				)}
			</div>
		</main>
	);
}
