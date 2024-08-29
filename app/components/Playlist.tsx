import Image from 'next/image';
import { VideoData } from '../libs/types';
import styles from './Playlist.module.scss';

interface Props {
	navbarVisible: boolean;
	playlist: VideoData[];
}

export default function Playlist({ navbarVisible, playlist }: Props) {
	console.log(playlist);
	return (
		<div
			style={{
				height: navbarVisible ? 'calc(100vh - 80px)' : '100vh',
			}}
			className={`${styles.playlist} d-flex flex-column gap-2 p-2 bg-dark`}
		>
			{playlist.map((video) => (
				<div key={video.id} className='d-flex gap-2'>
					{video.thumbnailUrl && (
						// !! Add placeholder if no thumbnail is present
						<Image
							src={video.thumbnailUrl}
							width={100}
							height={100}
							alt='Video thumbnail'
						/>
					)}
					<p>{video.title}</p>
				</div>
			))}
		</div>
	);
}
