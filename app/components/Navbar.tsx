import styles from './Navbar.module.scss';
import { useEffect, useState } from 'react';

interface Props {
	addVideo: (source: string, userInput: string) => void;
	toggleChat: (source: string, userInput: string) => void;
}

export default function Navbar({ addVideo, toggleChat }: Props) {
	const [source, setSource] = useState<string>('youtube');
	const [userInput, setUserInput] = useState<string>('-FFyqea427M');
	const [showNavbar, setShowNavbar] = useState<boolean>(true);

	function handleSourceChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const { value } = e.target;
		setSource(value);
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
				className='d-flex flex-row gap-3'
				onSubmit={(e) => e.preventDefault()}
			>
				<fieldset>
					<label className='text-capitalize' htmlFor='source'>
						Source
					</label>
					<select
						className='ms-1 px-1'
						id='source'
						name='source'
						value={source}
						onChange={handleSourceChange}
					>
						<option value=''>Select</option>
						<option value='youtube'>Youtube</option>
						<option value='twitch'>Twitch</option>
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
					onClick={() => addVideo(source, userInput)}
				>
					Go
				</button>
			</form>
			<button
				className='btn btn-primary py-0 px-2 fw-bold text-uppercase'
				type='button'
				onClick={() => toggleChat(source, userInput)}
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
