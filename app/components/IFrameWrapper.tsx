export function IFrameWrapper({ src }: { src: string }) {
	return (
		<iframe
			width='100%'
			height='100%'
			src={src}
			title='Twitch video player'
			allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share'
			sandbox='allow-modals allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation'
			referrerPolicy='strict-origin-when-cross-origin'
			allowFullScreen
		></iframe>
	);
}
