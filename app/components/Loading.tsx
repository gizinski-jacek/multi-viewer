export default function Loading({
	styleClass,
	style,
}: {
	styleClass?: string;
	style?: React.CSSProperties;
}) {
	return (
		<svg
			className={styleClass}
			style={style}
			xmlns='http://www.w3.org/2000/svg'
			xmlnsXlink='http://www.w3.org/1999/xlink'
			x='0px'
			y='0px'
			width='160'
			height='160'
			viewBox='0 0 52 105'
			enableBackground='new 0 0 0 0'
			xmlSpace='preserve'
		>
			<circle fill='#0ff' stroke='none' cx='-18' cy='50' r='6'>
				<animate
					attributeName='opacity'
					dur='1s'
					values='0;1;0'
					repeatCount='indefinite'
					begin='0.1'
				/>
			</circle>
			<circle fill='#0ff' stroke='none' cx='4' cy='50' r='6'>
				<animate
					attributeName='opacity'
					dur='1s'
					values='0;1;0'
					repeatCount='indefinite'
					begin='0.2'
				/>
			</circle>
			<circle fill='#0ff' stroke='none' cx='26' cy='50' r='6'>
				<animate
					attributeName='opacity'
					dur='1s'
					values='0;1;0'
					repeatCount='indefinite'
					begin='0.3'
				/>
			</circle>
			<circle fill='#0ff' stroke='none' cx='48' cy='50' r='6'>
				<animate
					attributeName='opacity'
					dur='1s'
					values='0;1;0'
					repeatCount='indefinite'
					begin='0.4'
				/>
			</circle>
			<circle fill='#0ff' stroke='none' cx='70' cy='50' r='6'>
				<animate
					attributeName='opacity'
					dur='1s'
					values='0;1;0'
					repeatCount='indefinite'
					begin='0.5'
				/>
			</circle>
		</svg>
	);
}
