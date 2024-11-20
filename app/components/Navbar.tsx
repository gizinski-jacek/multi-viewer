import styles from './Navbar.module.scss';
import { useState } from 'react';
import { hostList, Hosts } from '@/libs/types';
import { capitalizeWords } from '@/libs/utils';

interface Props {
	addVideo: (host: Hosts, userInput: string) => void;
	redirect: () => void;
	toggleChat: (host: string, userInput: string) => void;
	activeChat: boolean;
	showNavbar: boolean;
	toggleNavbar: () => void;
	togglePlaylist: () => void;
	disablePlaylist: boolean;
	toggleLayout: () => void;
	manualGridColSize: 'auto' | 1 | 2;
}

export default function Navbar({
	addVideo,
	redirect,
	toggleChat,
	activeChat,
	showNavbar,
	toggleNavbar,
	togglePlaylist,
	disablePlaylist,
	toggleLayout,
	manualGridColSize,
}: Props) {
	const [host, setHost] = useState<Hosts>('');
	const [userInput, setUserInput] = useState<string>('');
	const [showControls, setShowControls] = useState<boolean>(false);

	function handleHostChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const { value } = e.target as { value: Hosts };
		setHost(value);
	}

	function handleUserInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;
		setUserInput(value);
	}

	function handleInputEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter' && host && userInput) {
			setUserInput('');
			addVideo(host, userInput);
		}
	}

	function handleAddVideo() {
		if (!userInput || !host) return;
		setUserInput('');
		addVideo(host, userInput);
	}

	function toggleControlsVisibility(e: React.MouseEvent<HTMLButtonElement>) {
		setShowControls((prevState) => !prevState);
	}

	return (
		<nav className={showNavbar ? styles['navbar'] : styles['navbar-hidden']}>
			<div className={styles['home-link']} onClick={redirect}>
				MultiViewer
			</div>
			<form
				className='d-flex flex-row gap-1'
				onSubmit={(e) => e.preventDefault()}
			>
				<fieldset>
					<label className='d-none text-capitalize' htmlFor='host'>
						Select host
					</label>
					<select
						className='px-1'
						id='host'
						name='host'
						value={host}
						onChange={handleHostChange}
					>
						{hostList.map((host) => (
							<option key={host} value={host}>
								{host
									? host === 'm3u8'
										? host
										: capitalizeWords(host.replace('-', ' '))
									: 'Select host'}
							</option>
						))}
					</select>
				</fieldset>
				<fieldset>
					<label className='d-none text-capitalize' htmlFor='userInput'>
						Link or id
					</label>
					<input
						className='px-1'
						id='userInput'
						name='userInput'
						type='text'
						value={userInput}
						onChange={handleUserInputChange}
						onKeyDown={handleInputEnterKey}
						placeholder={host === 'm3u8' ? 'm3u8 link' : 'Link or id'}
					/>
				</fieldset>
				<button
					className='btn btn-primary py-0 px-2 fw-bold text-uppercase'
					type='button'
					onClick={handleAddVideo}
				>
					<svg
						width='24px'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
						fill='#000000'
					>
						<g strokeWidth='0'></g>
						<g strokeLinecap='round' strokeLinejoin='round'></g>
						<g>
							<g>
								<g>
									<g>
										<line
											fill='none'
											stroke='#ffffff'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
											x1='12'
											x2='12'
											y1='19'
											y2='5'
										></line>
										<line
											fill='none'
											stroke='#ffffff'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
											x1='5'
											x2='19'
											y1='12'
											y2='12'
										></line>
									</g>
								</g>
							</g>
						</g>
					</svg>
				</button>
			</form>
			<div className={styles['controls-dropdown']}>
				<button
					className='btn btn-primary py-0 px-2 fw-bold text-uppercase'
					type='button'
					onClick={toggleControlsVisibility}
				>
					<svg
						width='24px'
						viewBox='0 0 16 16'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<g strokeLinecap='round' strokeLinejoin='round'></g>
						<g>
							<path
								fillRule='evenodd'
								clipRule='evenodd'
								d='M6.50001 0H9.50001L10.0939 2.37548C10.7276 2.6115 11.3107 2.95155 11.8223 3.37488L14.1782 2.70096L15.6782 5.29904L13.9173 7.00166C13.9717 7.32634 14 7.65987 14 8C14 8.34013 13.9717 8.67366 13.9173 8.99834L15.6782 10.701L14.1782 13.299L11.8223 12.6251C11.3107 13.0484 10.7276 13.3885 10.0939 13.6245L9.50001 16H6.50001L5.90614 13.6245C5.27242 13.3885 4.68934 13.0484 4.17768 12.6251L1.82181 13.299L0.321808 10.701L2.08269 8.99834C2.02831 8.67366 2.00001 8.34013 2.00001 8C2.00001 7.65987 2.02831 7.32634 2.08269 7.00166L0.321808 5.29904L1.82181 2.70096L4.17768 3.37488C4.68934 2.95155 5.27241 2.6115 5.90614 2.37548L6.50001 0ZM8.00001 10C9.10458 10 10 9.10457 10 8C10 6.89543 9.10458 6 8.00001 6C6.89544 6 6.00001 6.89543 6.00001 8C6.00001 9.10457 6.89544 10 8.00001 10Z'
								fill='#ffffff'
							></path>
						</g>
					</svg>
				</button>
				<div
					className={`position-absolute top-100 end-0 my-2 gap-2 ${
						showControls ? 'd-flex' : 'd-none'
					}`}
				>
					<button
						className='btn btn-primary py-0 px-2 fw-bold text-uppercase'
						type='button'
						onClick={toggleLayout}
					>
						{manualGridColSize === 'auto' ? (
							<h3>A</h3>
						) : manualGridColSize === 1 ? (
							<svg
								width='24px'
								viewBox='0 0 24 24'
								fill='#000000'
								transform='rotate(90)'
								xmlns='http://www.w3.org/2000/svg'
							>
								<g strokeWidth='0'></g>
								<g strokeLinecap='round' strokeLinejoin='round'></g>
								<g>
									<g>
										<rect
											x='12'
											y='1.49'
											width='10.55'
											height='21.1'
											fill='none'
											stroke='#ffffff'
											strokeWidth='1.92px'
											strokeMiterlimit={10}
											transform='translate(34.54 24.07) rotate(180)'
										></rect>
										<rect
											x='1.45'
											y='1.49'
											width='10.55'
											height='21.1'
											fill='none'
											stroke='#ffffff'
											strokeWidth='1.92px'
											strokeMiterlimit={10}
											transform='translate(13.44 24.07) rotate(180)'
										></rect>
									</g>
								</g>
							</svg>
						) : manualGridColSize === 2 ? (
							<svg
								width='24px'
								viewBox='0 0 24 24'
								fill='#000000'
								xmlns='http://www.w3.org/2000/svg'
							>
								<g strokeWidth='0'></g>
								<g strokeLinecap='round' strokeLinejoin='round'></g>
								<g>
									<g>
										<rect
											x='12'
											y='1.49'
											width='10.55'
											height='21.1'
											fill='none'
											stroke='#ffffff'
											strokeWidth='1.92px'
											strokeMiterlimit={10}
											transform='translate(34.54 24.07) rotate(180)'
										></rect>
										<rect
											x='1.45'
											y='1.49'
											width='10.55'
											height='21.1'
											fill='none'
											stroke='#ffffff'
											strokeWidth='1.92px'
											strokeMiterlimit={10}
											transform='translate(13.44 24.07) rotate(180)'
										></rect>
									</g>
								</g>
							</svg>
						) : null}
					</button>
					<button
						className='btn btn-primary py-0 px-2 fw-bold text-uppercase'
						type='button'
						onClick={togglePlaylist}
						disabled={disablePlaylist}
					>
						<svg
							fill='#ffffff'
							width='24px'
							viewBox='0 0 32 32'
							fillRule='evenodd'
							clipRule='evenodd'
							strokeLinejoin='round'
							strokeMiterlimit={2}
							xmlns='http://www.w3.org/2000/svg'
						>
							<g strokeWidth='0'></g>
							<g strokeLinecap='round' strokeLinejoin='round'></g>
							<g>
								<path d='M5.011,19l21.989,-0c0.552,0 1,-0.448 1,-1c0,-0.552 -0.448,-1 -1,-1l-21.989,0c-0.552,0 -1,0.448 -1,1c-0,0.552 0.448,1 1,1Z'></path>
								<path d='M5.019,28l21.981,-0c0.552,0 1,-0.448 1,-1c0,-0.552 -0.448,-1 -1,-1l-21.981,0c-0.552,0 -1,0.448 -1,1c0,0.552 0.448,1 1,1Z'></path>
								<path d='M15.994,10l11.006,0c0.552,-0 1,-0.448 1,-1c-0,-0.552 -0.448,-1 -1,-1l-11.006,0c-0.552,-0 -1,0.448 -1,1c-0,0.552 0.448,1 1,1Z'></path>
								<path d='M12.496,9.868c0.312,-0.178 0.504,-0.509 0.504,-0.868c-0,-0.359 -0.192,-0.69 -0.504,-0.868l-7,-4c-0.309,-0.177 -0.69,-0.176 -0.998,0.003c-0.308,0.179 -0.498,0.509 -0.498,0.865l-0,8c-0,0.356 0.19,0.686 0.498,0.865c0.308,0.179 0.689,0.18 0.998,0.003l7,-4Z'></path>
							</g>
						</svg>
					</button>
					<button
						className='btn btn-primary py-0 px-2 fw-bold text-uppercase'
						type='button'
						onClick={() => toggleChat(host, userInput)}
						disabled={!activeChat}
					>
						<svg
							width='24px'
							fill='#ffffff'
							viewBox='0 0 29.996 29.997'
							xmlns='http://www.w3.org/2000/svg'
						>
							<g strokeWidth='0'></g>
							<g strokeLinecap='round' strokeLinejoin='round'></g>
							<g>
								<g>
									<g>
										<path d='M27.345,28.665c-0.64-0.467-1.131-0.819-1.615-1.184c-1.549-1.158-3.076-2.353-4.656-3.468 c-0.424-0.299-1.008-0.508-1.52-0.514c-3.367-0.045-6.736-0.01-10.104-0.037c-0.58-0.004-1.158-0.178-1.738-0.271 c-0.006-0.09-0.013-0.179-0.019-0.27c0.841-0.639,1.671-1.295,2.533-1.904c0.182-0.128,0.479-0.125,0.725-0.126 c3.255-0.009,6.511-0.019,9.766,0.014c0.383,0.004,0.811,0.188,1.135,0.41c0.938,0.646,1.836,1.352,2.9,2.146 c0-0.944,0-1.709,0-2.57c0.893,0,1.69,0,2.534,0c0-3.955,0-7.809,0-11.75c-1.169,0-2.286-0.028-3.397,0.033 c-0.156,0.009-0.406,0.455-0.412,0.702c-0.035,1.823-0.011,3.648-0.021,5.473c-0.014,1.921-0.983,2.896-2.908,2.899 c-3.366,0.01-6.735-0.021-10.104,0.023c-0.513,0.008-1.101,0.211-1.52,0.512c-1.895,1.354-3.74,2.772-5.606,4.168 c-0.191,0.143-0.398,0.264-0.736,0.486c0-1.545-0.017-2.937,0.009-4.324c0.01-0.533-0.047-0.839-0.698-0.969 c-1.118-0.224-1.87-1.226-1.876-2.392c-0.021-3.958-0.025-7.915-0.003-11.872c0.006-1.431,1.074-2.528,2.5-2.534 C8.661,1.326,14.807,1.327,20.953,1.35c1.387,0.006,2.423,1.079,2.49,2.464c0.029,0.616,0.049,1.237,0.004,1.852 c-0.051,0.671,0.132,0.961,0.877,0.907c0.977-0.069,1.964-0.027,2.943-0.011c1.594,0.025,2.687,1.016,2.701,2.609 c0.041,3.9,0.031,7.802,0,11.703c-0.012,1.33-0.771,2.244-2.046,2.533c-0.464,0.104-0.589,0.291-0.582,0.727 c0.019,1.179,0.005,2.357,0.003,3.535C27.345,27.938,27.345,28.207,27.345,28.665z M20.73,15.677 c0.067-0.188,0.104-0.24,0.104-0.292c0.01-3.616,0.006-7.23,0.029-10.848c0.004-0.585-0.315-0.609-0.75-0.609 c-5.581,0.007-11.16,0.014-16.74-0.007C2.743,3.919,2.566,4.117,2.572,4.739c0.029,3.393,0.014,6.785,0.02,10.178 c0,0.238,0.041,0.477,0.07,0.789c0.884,0,1.685,0,2.592,0c0,0.838,0,1.598,0,2.525c1.068-0.802,1.964-1.515,2.906-2.156 c0.321-0.223,0.755-0.373,1.143-0.384c1.541-0.042,3.083-0.016,4.626-0.014C16.193,15.677,18.462,15.677,20.73,15.677z'></path>
										<g>
											<circle cx='7.457' cy='9.917' r='1.438'></circle>
											<circle cx='12.332' cy='9.917' r='1.438'></circle>
											<circle cx='17.207' cy='9.917' r='1.438'></circle>
										</g>
									</g>
								</g>
							</g>
						</svg>
					</button>
				</div>
			</div>
			<div className={styles.controls}>
				<button
					className='btn btn-primary py-0 px-2 fw-bold text-uppercase'
					type='button'
					onClick={toggleLayout}
				>
					{manualGridColSize === 'auto' ? (
						<h3>A</h3>
					) : manualGridColSize === 1 ? (
						<svg
							width='24px'
							viewBox='0 0 24 24'
							fill='#000000'
							transform='rotate(90)'
							xmlns='http://www.w3.org/2000/svg'
						>
							<g strokeWidth='0'></g>
							<g strokeLinecap='round' strokeLinejoin='round'></g>
							<g>
								<g>
									<rect
										x='12'
										y='1.49'
										width='10.55'
										height='21.1'
										fill='none'
										stroke='#ffffff'
										strokeWidth='1.92px'
										strokeMiterlimit={10}
										transform='translate(34.54 24.07) rotate(180)'
									></rect>
									<rect
										x='1.45'
										y='1.49'
										width='10.55'
										height='21.1'
										fill='none'
										stroke='#ffffff'
										strokeWidth='1.92px'
										strokeMiterlimit={10}
										transform='translate(13.44 24.07) rotate(180)'
									></rect>
								</g>
							</g>
						</svg>
					) : manualGridColSize === 2 ? (
						<svg
							width='24px'
							viewBox='0 0 24 24'
							fill='#000000'
							xmlns='http://www.w3.org/2000/svg'
						>
							<g strokeWidth='0'></g>
							<g strokeLinecap='round' strokeLinejoin='round'></g>
							<g>
								<g>
									<rect
										x='12'
										y='1.49'
										width='10.55'
										height='21.1'
										fill='none'
										stroke='#ffffff'
										strokeWidth='1.92px'
										strokeMiterlimit={10}
										transform='translate(34.54 24.07) rotate(180)'
									></rect>
									<rect
										x='1.45'
										y='1.49'
										width='10.55'
										height='21.1'
										fill='none'
										stroke='#ffffff'
										strokeWidth='1.92px'
										strokeMiterlimit={10}
										transform='translate(13.44 24.07) rotate(180)'
									></rect>
								</g>
							</g>
						</svg>
					) : null}
				</button>
				<button
					className='btn btn-primary py-0 px-2 fw-bold text-uppercase'
					type='button'
					onClick={togglePlaylist}
					disabled={disablePlaylist}
				>
					<svg
						fill='#ffffff'
						width='24px'
						viewBox='0 0 32 32'
						fillRule='evenodd'
						clipRule='evenodd'
						strokeLinejoin='round'
						strokeMiterlimit={2}
						xmlns='http://www.w3.org/2000/svg'
					>
						<g strokeWidth='0'></g>
						<g strokeLinecap='round' strokeLinejoin='round'></g>
						<g>
							<path d='M5.011,19l21.989,-0c0.552,0 1,-0.448 1,-1c0,-0.552 -0.448,-1 -1,-1l-21.989,0c-0.552,0 -1,0.448 -1,1c-0,0.552 0.448,1 1,1Z'></path>
							<path d='M5.019,28l21.981,-0c0.552,0 1,-0.448 1,-1c0,-0.552 -0.448,-1 -1,-1l-21.981,0c-0.552,0 -1,0.448 -1,1c0,0.552 0.448,1 1,1Z'></path>
							<path d='M15.994,10l11.006,0c0.552,-0 1,-0.448 1,-1c-0,-0.552 -0.448,-1 -1,-1l-11.006,0c-0.552,-0 -1,0.448 -1,1c-0,0.552 0.448,1 1,1Z'></path>
							<path d='M12.496,9.868c0.312,-0.178 0.504,-0.509 0.504,-0.868c-0,-0.359 -0.192,-0.69 -0.504,-0.868l-7,-4c-0.309,-0.177 -0.69,-0.176 -0.998,0.003c-0.308,0.179 -0.498,0.509 -0.498,0.865l-0,8c-0,0.356 0.19,0.686 0.498,0.865c0.308,0.179 0.689,0.18 0.998,0.003l7,-4Z'></path>
						</g>
					</svg>
				</button>
				<button
					className='btn btn-primary py-0 px-2 fw-bold text-uppercase'
					type='button'
					onClick={() => toggleChat(host, userInput)}
					disabled={!activeChat}
				>
					<svg
						width='24px'
						fill='#ffffff'
						viewBox='0 0 29.996 29.997'
						xmlns='http://www.w3.org/2000/svg'
					>
						<g strokeWidth='0'></g>
						<g strokeLinecap='round' strokeLinejoin='round'></g>
						<g>
							<g>
								<g>
									<path d='M27.345,28.665c-0.64-0.467-1.131-0.819-1.615-1.184c-1.549-1.158-3.076-2.353-4.656-3.468 c-0.424-0.299-1.008-0.508-1.52-0.514c-3.367-0.045-6.736-0.01-10.104-0.037c-0.58-0.004-1.158-0.178-1.738-0.271 c-0.006-0.09-0.013-0.179-0.019-0.27c0.841-0.639,1.671-1.295,2.533-1.904c0.182-0.128,0.479-0.125,0.725-0.126 c3.255-0.009,6.511-0.019,9.766,0.014c0.383,0.004,0.811,0.188,1.135,0.41c0.938,0.646,1.836,1.352,2.9,2.146 c0-0.944,0-1.709,0-2.57c0.893,0,1.69,0,2.534,0c0-3.955,0-7.809,0-11.75c-1.169,0-2.286-0.028-3.397,0.033 c-0.156,0.009-0.406,0.455-0.412,0.702c-0.035,1.823-0.011,3.648-0.021,5.473c-0.014,1.921-0.983,2.896-2.908,2.899 c-3.366,0.01-6.735-0.021-10.104,0.023c-0.513,0.008-1.101,0.211-1.52,0.512c-1.895,1.354-3.74,2.772-5.606,4.168 c-0.191,0.143-0.398,0.264-0.736,0.486c0-1.545-0.017-2.937,0.009-4.324c0.01-0.533-0.047-0.839-0.698-0.969 c-1.118-0.224-1.87-1.226-1.876-2.392c-0.021-3.958-0.025-7.915-0.003-11.872c0.006-1.431,1.074-2.528,2.5-2.534 C8.661,1.326,14.807,1.327,20.953,1.35c1.387,0.006,2.423,1.079,2.49,2.464c0.029,0.616,0.049,1.237,0.004,1.852 c-0.051,0.671,0.132,0.961,0.877,0.907c0.977-0.069,1.964-0.027,2.943-0.011c1.594,0.025,2.687,1.016,2.701,2.609 c0.041,3.9,0.031,7.802,0,11.703c-0.012,1.33-0.771,2.244-2.046,2.533c-0.464,0.104-0.589,0.291-0.582,0.727 c0.019,1.179,0.005,2.357,0.003,3.535C27.345,27.938,27.345,28.207,27.345,28.665z M20.73,15.677 c0.067-0.188,0.104-0.24,0.104-0.292c0.01-3.616,0.006-7.23,0.029-10.848c0.004-0.585-0.315-0.609-0.75-0.609 c-5.581,0.007-11.16,0.014-16.74-0.007C2.743,3.919,2.566,4.117,2.572,4.739c0.029,3.393,0.014,6.785,0.02,10.178 c0,0.238,0.041,0.477,0.07,0.789c0.884,0,1.685,0,2.592,0c0,0.838,0,1.598,0,2.525c1.068-0.802,1.964-1.515,2.906-2.156 c0.321-0.223,0.755-0.373,1.143-0.384c1.541-0.042,3.083-0.016,4.626-0.014C16.193,15.677,18.462,15.677,20.73,15.677z'></path>
									<g>
										<circle cx='7.457' cy='9.917' r='1.438'></circle>
										<circle cx='12.332' cy='9.917' r='1.438'></circle>
										<circle cx='17.207' cy='9.917' r='1.438'></circle>
									</g>
								</g>
							</g>
						</g>
					</svg>
				</button>
			</div>
			<div
				className={showNavbar ? styles['hide-nav-btn'] : styles['show-nav-btn']}
				onClick={toggleNavbar}
			></div>
		</nav>
	);
}
