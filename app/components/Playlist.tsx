import styles from './Playlist.module.scss';
import Image from 'next/image';
import { VideoData } from '../libs/types';

interface Props {
	navbarVisible: boolean;
	playlist: VideoData[];
	removeVideo: (video: VideoData) => void;
}

export default function Playlist({
	navbarVisible,
	playlist,
	removeVideo,
}: Props) {
	return (
		<div
			style={{
				height: navbarVisible ? 'calc(100vh - 80px)' : '100vh',
			}}
			className={styles.playlist}
		>
			<div className={styles.container}>
				{playlist.map((video, i) => (
					<div key={video.id} className={styles.video}>
						{video.thumbnailUrl ? (
							<Image
								src={video.thumbnailUrl}
								width={100}
								height={100}
								alt='Video thumbnail'
							/>
						) : (
							<div className={`${styles.placeholder} position-relative`}></div>
						)}
						<p>
							<div
								className={`${styles['remove-video']} btn btn-warning p-0 ms-1 mb-1`}
								onClick={() => removeVideo(video)}
							>
								<svg
									width='24px'
									viewBox='0 0 24 24'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g strokeWidth='0'></g>
									<g strokeLinecap='round' strokeLinejoin='round'></g>
									<g>
										<path
											d='M7 17L16.8995 7.10051'
											stroke='#000000'
											strokeWidth='1.5'
											strokeLinecap='round'
											strokeLinejoin='round'
										></path>
										<path
											d='M7 7.00001L16.8995 16.8995'
											stroke='#000000'
											strokeWidth='1.5'
											strokeLinecap='round'
											strokeLinejoin='round'
										></path>
									</g>
								</svg>
							</div>
							{video.title}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
