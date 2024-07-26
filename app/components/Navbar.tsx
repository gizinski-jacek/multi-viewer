import { Hosts } from '../libs/types';
import styles from './Navbar.module.scss';
import { useEffect, useState } from 'react';

interface Props {
	addVideo: (host: Hosts, userInput: string) => void;
	toggleChat: (host: string, userInput: string) => void;
	activeChat: boolean;
	showNavbar: boolean;
	toggleNavbar: () => void;
}

export default function Navbar({
	addVideo,
	toggleChat,
	activeChat,
	showNavbar,
	toggleNavbar,
}: Props) {
	const [host, setHost] = useState<Hosts>('');
	const [userInput, setUserInput] = useState<string>('');

	function handleHostChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const { value } = e.target as { value: Hosts };
		setHost(value);
	}

	function handleUserInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;
		setUserInput(value);
	}

	useEffect(() => {
		document.documentElement.style.setProperty(
			'--navbar-height',
			showNavbar ? '48px' : '0'
		);
	}, [showNavbar]);

	return (
		<nav className={showNavbar ? styles['navbar'] : styles['navbar-hidden']}>
			<div className='d-none d-sm-inline-block my-auto'>MultiViewer</div>
			<form
				className='d-flex flex-row gap-2'
				onSubmit={(e) => e.preventDefault()}
			>
				<fieldset>
					<label
						className='d-none d-md-inline-block text-capitalize'
						htmlFor='host'
					>
						Host
					</label>
					<select
						className='ms-1 px-1'
						id='host'
						name='host'
						value={host}
						onChange={handleHostChange}
					>
						<option value=''>Select</option>
						<option value='youtube'>Youtube</option>
						<option value='youtube-playlist'>Youtube Playlist</option>
						<option value='twitch'>Twitch</option>
						<option value='twitch-vod'>Twitch VOD</option>
						<option value='dailymotion'>Dailymotion</option>
						<option value='dailymotion-playlist'>Dailymotion Playlist</option>
						<option value='vimeo'>Vimeo</option>
					</select>
				</fieldset>
				<fieldset>
					<label
						className='d-none d-md-inline-block text-capitalize'
						htmlFor='userInput'
					>
						Link/Id
					</label>
					<input
						className='ms-1 px-1'
						id='userInput'
						name='userInput'
						type='text'
						value={userInput}
						onChange={handleUserInputChange}
					/>
				</fieldset>
				<button
					className='btn btn-primary py-0 px-2 fw-bold text-uppercase'
					type='button'
					onClick={() => addVideo(host, userInput)}
				>
					Go
				</button>
			</form>
			<button
				className='btn btn-primary py-0 px-2 fw-bold text-uppercase'
				type='button'
				onClick={() => toggleChat(host, userInput)}
				disabled={!activeChat}
			>
				Chat
			</button>
			<div
				className={showNavbar ? styles['hide-nav-btn'] : styles['show-nav-btn']}
				onClick={toggleNavbar}
			></div>
		</nav>
	);
}
