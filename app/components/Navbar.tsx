import { useState } from 'react';

interface Props {
	addVideo: (source: string, userInput: string) => void;
	toggleChat: (source: string, userInput: string) => void;
}

export default function Navbar({ addVideo, toggleChat }: Props) {
	const [source, setSource] = useState<string>('twitch');
	const [userInput, setUserInput] = useState<string>('cct_cs');

	function handleSourceChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const { value } = e.target;
		setSource(value);
	}

	function handleUserInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;
		setUserInput(value);
	}

	return (
		<nav className='d-flex flex-row justify-content-between'>
			<div>MultiViewer</div>
			<form
				className='d-flex flex-row align-items-center gap-4'
				onSubmit={(e) => e.preventDefault()}
			>
				<fieldset>
					<label className='d-none' htmlFor='source'></label>
					<select
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
					<label htmlFor='userInput'>Link/Id</label>
					<input
						className='ms-2'
						id='userInput'
						name='userInput'
						type='text'
						value={userInput}
						onChange={handleUserInputChange}
					/>
				</fieldset>
				<button
					className='btn btn-primary text-capitalize'
					type='button'
					onClick={() => addVideo(source, userInput)}
				>
					Go
				</button>
			</form>
			<button
				className='btn btn-primary text-capitalize'
				type='button'
				onClick={() => toggleChat(source, userInput)}
			>
				Chat
			</button>
		</nav>
	);
}
