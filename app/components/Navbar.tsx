import { Hosts } from '../libs/types';
import styles from './Navbar.module.scss';
import { useEffect, useState } from 'react';

interface Props {
	addVideo: (host: Hosts, userInput: string) => void;
	toggleChat: (host: string, userInput: string) => void;
	activeChat: boolean;
}

export default function Navbar({ addVideo, toggleChat, activeChat }: Props) {
	const [host, setHost] = useState<Hosts>('');
	const [userInput, setUserInput] = useState<string>('');
	const [showNavbar, setShowNavbar] = useState<boolean>(true);

	function handleHostChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const { value } = e.target as { value: Hosts };
		setHost(value);
	}

	function handleUserInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;
		setUserInput(value);
	}

	function toggleNavbarVisibility(e: React.MouseEvent<HTMLElement>) {
		setShowNavbar((prevState) => !prevState);
	}

	useEffect(() => {
		document.documentElement.style.setProperty(
			'--navbar-height',
			showNavbar ? '48px' : '0'
		);
	}, [showNavbar]);

	return (
		<nav className={showNavbar ? styles['navbar'] : styles['navbar-hidden']}>
			<div>MultiViewer</div>
			<form
				className='d-flex flex-row gap-2'
				onSubmit={(e) => e.preventDefault()}
			>
				<fieldset>
					<label className='text-capitalize' htmlFor='host'>
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
						<option value='twitch'>Twitch</option>
						<option value='twitch-vod'>Twitch VOD</option>
						<option value='dailymotion'>Dailymotion</option>
						<option value='vimeo'>Vimeo</option>
					</select>
				</fieldset>
				<fieldset>
					<label className='text-capitalize' htmlFor='userInput'>
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
				onClick={toggleNavbarVisibility}
			></div>
		</nav>
	);
}
