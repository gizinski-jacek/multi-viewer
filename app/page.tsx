'use client';

import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import {
	createIFrameChatSource,
	createIFrameVideoSource,
	getVideoData,
	sourceExtractURIList,
} from './libs/utils';
import { IFrameWrapper } from './components/IFrameWrapper';
import Navbar from './components/Navbar';
import { Sources, VideoData } from './libs/types';
import Loading from './components/Loading';

export default function App() {
	const [fetching, setFetching] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [videoData, setVideoData] = useState<VideoData[]>([]);
	const [openChat, setOpenChat] = useState<boolean>(false);
	const [activeChat, setActiveChat] = useState<VideoData | null>(null);

	async function handleAddVideo(source: Sources, userInput: string) {
		try {
			if (fetching) return;
			setFetching(true);
			if (!source) {
				setError('Select source');
				return;
			}
			if (!userInput) {
				setError('Provide link/Id');
				return;
			}
			const id = userInput.replace(sourceExtractURIList[source], '');
			if (videoData.find((vid) => vid.id === id && vid.source === source)) {
				setFetching(false);
				return;
			}
			const data = await getVideoData(source, id);
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
			prevState.filter(
				(vid) => vid.id !== video.id && vid.source !== video.source
			)
		);
		if (activeChat?.id === video.id && activeChat.source === video.source) {
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

	useEffect(
		function () {
			document.documentElement.style.setProperty(
				'--chat-open',
				openChat ? '1' : '0'
			);
		},
		[openChat]
	);

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
				<div className={styles['video-list']}>
					{videoData.map((vid) => (
						<div key={vid.id} className={styles.video}>
							<div
								className={`${styles['close-video']} btn btn-warning p-0`}
								onClick={() => handleRemoveVideo(vid)}
							>
								Close
							</div>
							<IFrameWrapper
								src={createIFrameVideoSource(vid.source, vid.iFrameSrcId)}
							/>
						</div>
					))}
					{fetching && <Loading styleClass='m-auto w-100' />}
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
														activeChat?.source === vid.source
															? 'btn-primary'
															: 'btn-secondary'
													}`}
													key={vid.id}
													onClick={() => handleChangeChat(vid)}
												>
													{vid.name}
												</div>
											)
									)}
								</div>
								<div className='flex-fill'>
									{activeChat && (
										<IFrameWrapper
											src={createIFrameChatSource(
												activeChat.source,
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
