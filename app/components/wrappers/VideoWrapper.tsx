import styles from './VideoWrapper.module.scss';
import { VideoData } from '@/app/libs/types';
import { IFrameWrapper } from './IFrameWrapper';
import { createIFrameVideoSource } from '@/app/libs/utils';

interface Props {
	video: VideoData;
	removeVideo: (video: VideoData) => void;
}

export default function VideoWrapper({ video, removeVideo }: Props) {
	return (
		<div className={styles.video}>
			<div
				className={`${styles['remove-video']} btn btn-danger`}
				onClick={() => removeVideo(video)}
			>
				<svg
					width='24px'
					viewBox='0 0 24 24'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<g strokeLinecap='round' strokeLinejoin='round'></g>
					<g>
						<g>
							<path
								d='M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18'
								stroke='#000000'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							></path>
						</g>
					</g>
				</svg>
			</div>
			<IFrameWrapper
				src={createIFrameVideoSource(video.host, video.iFrameSrcId)}
				title={`${video.host} video player`}
			/>
		</div>
	);
}
