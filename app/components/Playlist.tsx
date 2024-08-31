import styles from './Playlist.module.scss';
import Image from 'next/image';
import { VideoData } from '../libs/types';

interface Props {
	navbarVisible: boolean;
	playlist: VideoData[];
	removeVideo: (video: VideoData) => void;
	reorderVideo: (video: VideoData, index: number) => void;
}

export default function Playlist({
	navbarVisible,
	playlist,
	removeVideo,
	reorderVideo,
}: Props) {
	return (
		<div
			style={{
				height: navbarVisible ? 'calc(100vh - 80px)' : '100vh',
			}}
			className={styles.playlist}
		>
			<div className={styles.container}>
				{playlist.map((video, index) => (
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
						<p className='flex-grow-1 m-0'>{video.title}</p>
						<div className='d-flex flex-column gap-1 justify-content-between'>
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
							<div
								className='btn btn-warning p-0 ms-1 mb-1'
								onClick={() => reorderVideo(video, index - 1)}
							>
								<svg
									width='24px'
									fill='#000000'
									viewBox='0 0 32 32'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g strokeWidth='0'></g>
									<g strokeLinecap='round' strokeLinejoin='round'></g>
									<g>
										<path d='M8 20.695l7.997-11.39L24 20.695z'></path>
									</g>
								</svg>
							</div>
							<div
								className='btn btn-warning p-0 ms-1 mb-1'
								onClick={() => reorderVideo(video, index + 1)}
							>
								<svg
									width='24px'
									fill='#000000'
									viewBox='0 0 32 32'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g strokeWidth='0'></g>
									<g strokeLinecap='round' strokeLinejoin='round'></g>
									<g>
										<path d='M24 11.305l-7.997 11.39L8 11.305z'></path>
									</g>
								</svg>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
