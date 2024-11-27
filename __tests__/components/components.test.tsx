/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import Playlist from '@/components/Playlist';
import { hostList, Hosts } from '@/libs/types';
import stylesNavbar from './Navbar.module.scss';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';

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

jest.mock('app/components/Navbar', () => {
	const Navbar = ({ addVideo, showNavbar }: Props) => {
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

		return (
			<nav
				className={
					showNavbar ? stylesNavbar['navbar'] : stylesNavbar['navbar-hidden']
				}
				data-testid='Navbar'
			>
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
							data-testid='hostSelect'
						>
							{hostList.map((host, i) => (
								<option key={host} value={host} data-testid='hostOption'>
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
							data-testid='userInput'
						/>
					</fieldset>
					<button
						className='btn btn-primary py-0 px-2 fw-bold text-uppercase'
						type='button'
						onClick={handleAddVideo}
						data-testid='handleAddVideo'
					></button>
				</form>
			</nav>
		);
	};
	return Navbar;
});

const capitalizeWords = jest.fn((string: string): string => {
	return string
		.split(' ')
		.map((str) => str.charAt(0).toUpperCase() + str.slice(1))
		.join(' ');
});

describe('components', () => {
	describe('Navbar', () => {
		const props: Props = {
			addVideo: jest.fn((host: Hosts, userInput: string) => {
				return { host, userInput };
			}),
			redirect: () => {},
			toggleChat: (host: string, userInput: string) => {
				return { host, userInput };
			},
			activeChat: false,
			showNavbar: true,
			toggleNavbar: () => {},
			togglePlaylist: () => {},
			disablePlaylist: true,
			toggleLayout: () => {},
			manualGridColSize: 'auto',
		};
		const user = userEvent.setup();

		it('renders Navbar component with passed props', () => {
			render(<Navbar {...props} />);
			const navbar = screen.getByTestId('Navbar');
			expect(navbar).toBeInTheDocument();
			expect(navbar).toMatchSnapshot();
			expect(navbar).toHaveClass('navbar');
		});

		it('renders input field and select with options elements matching hostList, properly changes select and input values', async () => {
			render(<Navbar {...props} />);
			const select: HTMLSelectElement = screen.getByTestId('hostSelect');
			const options: HTMLOptionElement[] = screen.getAllByTestId('hostOption');
			expect(select).toBeInTheDocument();
			expect(select).toMatchSnapshot();
			expect(options.length).toBe(hostList.length);
			expect(options[0]).toBeInTheDocument();
			expect(options[0]).toMatchSnapshot();
			expect(options[3].textContent?.toLowerCase()).toBe(hostList[3]);
			await user.selectOptions(select, options[1]);
			expect(select.value).toBe(hostList[1]);

			const userInput: HTMLInputElement = screen.getByTestId('userInput');
			expect(userInput).toBeInTheDocument();
			expect(userInput).toMatchSnapshot();
			expect(userInput.value).toBe('');
			await user.type(userInput, 'test input');
			expect(userInput.value).toBe('test input');
		});

		it('properly calls addVideo prop only when input and select field values are not null', async () => {
			render(<Navbar {...props} />);
			const select: HTMLSelectElement = screen.getByTestId('hostSelect');
			const options: HTMLOptionElement[] = screen.getAllByTestId('hostOption');
			const userInput: HTMLInputElement = screen.getByTestId('userInput');
			const handleAddVideo = screen.getByTestId('handleAddVideo');
			expect(handleAddVideo).toBeInTheDocument();
			expect(handleAddVideo).toMatchSnapshot();
			expect(select.value).toBe('');
			expect(userInput.value).toBe('');
			await user.click(handleAddVideo);
			expect(props.addVideo).toHaveBeenCalledTimes(0);
			await user.selectOptions(select, options[2]);
			await user.type(userInput, 'test input');
			expect(select.value).toBe(hostList[2]);
			expect(userInput.value).toBe('test input');
			expect(select.value).not.toBe('');
			expect(userInput.value).not.toBe('');
			await user.click(handleAddVideo);
			expect(props.addVideo).toHaveBeenCalledWith(
				options[2].value,
				'test input'
			);
			expect(props.addVideo).toHaveBeenCalledTimes(1);
		});
	});

	describe('Playlist', () => {
		it('renders Playlist component', () => {
			// render(<Playlist data-testid='Playlist' />);
			// const playlist = screen.getByTestId('Playlist');
			// expect(playlist).toBeInTheDocument();
			// expect(playlist).toMatchSnapshot();
		});
	});
});
