import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

interface Props {
	url: string;
}

export default function HLSWrapper({ url }: Props) {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const hls = new Hls();
		if (Hls.isSupported() && videoRef.current) {
			hls.loadSource(url);
			hls.attachMedia(videoRef.current);
			hls.on(Hls.Events.ERROR, (err) => {
				console.error(err);
			});
		}
	}, [url]);

	return (
		<video
			width={'100%'}
			height={'100%'}
			ref={videoRef}
			controls
			src={url}
			title={'Stream wrapper'}
		/>
	);
}
