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
		<div key={video.id} className={styles.video}>
			<div
				className={`${styles['remove-video']} btn btn-warning`}
				onClick={() => removeVideo(video)}
			>
				<svg
					width='24px'
					viewBox='-0.5 0 25 25'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<g strokeWidth='0'></g>
					<g strokeLinecap='round' strokeLinejoin='round'></g>
					<g>
						<path
							d='M3 21.32L21 3.32001'
							stroke='#000000'
							strokeWidth='2.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						></path>
						<path
							d='M3 3.32001L21 21.32'
							stroke='#000000'
							strokeWidth='2.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						></path>
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
