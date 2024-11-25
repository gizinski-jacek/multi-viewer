import styles from './Playlist.module.scss';
import Image from 'next/image';
import { VideoData } from '@/libs/types';

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
			className={`${styles.playlist} ${
				navbarVisible ? styles.visible : styles.hidden
			}`}
		>
			<ul className={styles.container}>
				{playlist.map((video, index) => (
					<li key={video.id}>
						<div className={styles.video}>
							{video.thumbnailUrl ? (
								<Image
									src={video.thumbnailUrl}
									width={130}
									height={90}
									alt={`${video.title} thumbnail` || 'Video thumbnail'}
								/>
							) : (
								<div className={`${styles.placeholder} position-relative`} />
							)}
							<p className='flex-grow-1 m-0'>{video.title}</p>
							<div className='d-flex flex-column justify-content-between'>
								<button
									className='btn btn-danger rounded-0 p-0'
									typeof='button'
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
								</button>
								<button
									className='btn btn-warning rounded-0 p-0'
									typeof='button'
									onClick={() => reorderVideo(video, index - 1)}
									disabled={index === 0 || playlist.length < 2}
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
								</button>
								<button
									className='btn btn-warning rounded-0 p-0'
									onClick={() => reorderVideo(video, index + 1)}
									typeof='button'
									disabled={
										index === playlist.length - 1 || playlist.length < 2
									}
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
								</button>
							</div>
						</div>
						{index !== playlist.length - 1 && <hr />}
					</li>
				))}
			</ul>
		</div>
	);
}
