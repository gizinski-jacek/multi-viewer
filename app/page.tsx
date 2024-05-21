'use client';

import styles from './page.module.scss';
import { useState } from 'react';
import {
	createIFrameChatSource,
	createIFrameVideoSource,
	getVideoData,
	sourceExtractURIList,
} from './libs/utils';
import { IFrameWrapper } from './components/IFrameWrapper';
import Navbar from './components/Navbar';
import { VideoData } from './libs/types';
import Loading from './components/Loading';

export default function App() {
	const [fetching, setFetching] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [videoData, setVideoData] = useState<VideoData[]>([]);
	const [openChat, setOpenChat] = useState<boolean>(false);
	const [activeChat, setActiveChat] = useState<VideoData | null>(null);

	async function handleAddVideo(source: string, userInput: string) {
		try {
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
			if (videoData.find((v) => v.id === id)) return;
			const data = await getVideoData(source, id);
			setVideoData((prevState) => [...prevState, data]);
			setFetching(false);
		} catch (error: any) {
			setError(typeof error === 'string' ? error : 'Unknown error');
		}
	}

	// function handleRemoveVideo(vidId: string) {
	// 	if (!vidId) {
	// 		setError('Provide Id');
	// 		return;
	// 	}
	// 	setVideoData((prevState) => prevState.filter((v) => v.id !== vidId));
	// }

	function handleChatToggle() {
		if (!openChat && !activeChat) {
			setActiveChat(videoData[0]);
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

	return (
		<main className={styles.app}>
			<Navbar addVideo={handleAddVideo} toggleChat={handleChatToggle} />
			<div className='flex-fill d-flex flex-row gap-3'>
				<div className='flex-fill d-flex flex-column align-items-center'>
					{videoData.map((vid) => (
						<div
							key={vid.id}
							className={styles.video}
							style={{ '--chat-open': openChat ? 1 : 0 } as React.CSSProperties}
						>
							<IFrameWrapper
								src={createIFrameVideoSource(vid.source, vid.iFrameSrcId)}
							/>
						</div>
					))}
					{fetching && <Loading margin='0 2rem' />}
				</div>
				{openChat && (
					<div className={styles.chat}>
						<div className='d-flex flex-row gap-1'>
							{videoData.map((v) => (
								<div key={v.id} onClick={() => handleChangeChat(v)}>
									{v.name}
								</div>
							))}
						</div>
						{activeChat && (
							<IFrameWrapper
								src={createIFrameChatSource(activeChat.source, activeChat.id)}
							/>
						)}
					</div>
				)}
			</div>
		</main>
	);
}
