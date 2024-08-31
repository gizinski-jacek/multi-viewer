import styles from './Chat.module.scss';
import { VideoData } from '../libs/types';
import { createIFrameChatSource } from '../libs/utils';
import { IFrameWrapper } from './wrappers/IFrameWrapper';

interface Props {
	videoData: VideoData[];
	activeChat: VideoData | null;
	changeChat: (data: VideoData) => void;
}

export default function Chat({ videoData, activeChat, changeChat }: Props) {
	return (
		<div className={styles.chat}>
			{videoData.length ? (
				<>
					<div className={styles['chat-list']}>
						{videoData.map(
							(vid) =>
								vid.livestreamChat && (
									<div
										className={`btn p-0 px-1 text-nowrap overflow-hidden ${
											activeChat?.id === vid.id && activeChat?.host === vid.host
												? 'btn-primary'
												: 'btn-secondary'
										}`}
										key={vid.id}
										onClick={() => changeChat(vid)}
									>
										{vid.channelName}
									</div>
								)
						)}
					</div>
					<div className='flex-fill'>
						{activeChat && (
							<IFrameWrapper
								src={createIFrameChatSource(activeChat.host, activeChat.id)}
								title={`${activeChat.host} chat`}
							/>
						)}
					</div>
				</>
			) : (
				<div className='m-auto'>Add a video to see the chat</div>
			)}
		</div>
	);
}
