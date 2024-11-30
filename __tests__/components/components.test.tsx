/**
 * @jest-environment jsdom
 */

import { cleanup, render, screen } from '@testing-library/react';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { hostList, Hosts, VideoData } from '@/libs/types';
import Navbar from '@/components/Navbar';
import stylesNavbar from './Navbar.module.scss';
import Playlist from '@/components/Playlist';
import stylesPlaylist from './Navbar.module.scss';

interface PropsNavbar {
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
	const Navbar = ({ addVideo, showNavbar }: PropsNavbar) => {
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

interface PropsPlaylist {
	navbarVisible: boolean;
	playlist: VideoData[];
	removeVideo: (video: VideoData) => void;
	reorderVideo: (video: VideoData, index: number) => void;
}

jest.mock('app/components/Playlist', () => {
	const Playlist = ({
		navbarVisible,
		playlist,
		removeVideo,
		reorderVideo,
	}: PropsPlaylist) => {
		return (
			<div
				className={`${stylesPlaylist.playlist} ${
					navbarVisible ? stylesPlaylist.visible : stylesPlaylist.hidden
				}`}
				data-testid='Playlist'
			>
				<ul className={stylesPlaylist.container}>
					{playlist.map((video, index) => (
						<li key={video.id} data-testid='Item'>
							<div className={stylesPlaylist.video}>
								{video.thumbnailUrl ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={video.thumbnailUrl}
										width={130}
										height={90}
										alt={`${video.title} thumbnail` || 'Video thumbnail'}
									/>
								) : (
									<div
										className={`${stylesPlaylist.placeholder} position-relative`}
									/>
								)}
								<p className='flex-grow-1 m-0' data-testid='title'>
									{video.title}
								</p>
								<div className='d-flex flex-column justify-content-between'>
									<button
										className='btn btn-danger rounded-0 p-0'
										typeof='button'
										onClick={() => removeVideo(video)}
										data-testid='RemoveVid'
									></button>
									<button
										className='btn btn-warning rounded-0 p-0'
										typeof='button'
										onClick={() => reorderVideo(video, index - 1)}
										disabled={index === 0 || playlist.length < 2}
										data-testid='MoveVidUp'
									></button>
									<button
										className='btn btn-warning rounded-0 p-0'
										onClick={() => reorderVideo(video, index + 1)}
										typeof='button'
										disabled={
											index === playlist.length - 1 || playlist.length < 2
										}
										data-testid='MoveVidDown'
									></button>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		);
	};
	return Playlist;
});

const capitalizeWords = jest.fn((string: string): string => {
	return string
		.split(' ')
		.map((str) => str.charAt(0).toUpperCase() + str.slice(1))
		.join(' ');
});

describe('components', () => {
	describe('Navbar', () => {
		afterEach(cleanup);
		const props: PropsNavbar = {
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
		afterEach(cleanup);
		const props: PropsPlaylist = {
			navbarVisible: true,
			playlist: [
				{
					channelId: 'UCkK2B6D3imy6EnpqfrYm-5A',
					channelName: 'LoFi Tokyo',
					host: 'youtube',
					id: '7XXu_-eoxHo',
					livestreamChat: false,
					thumbnailUrl: 'https://i.ytimg.com/vi/7XXu_-eoxHo/default.jpg',
					title: "Playlist80's Tokyo Vibes",
				},
				{
					channelId: 'UCuS_-bvOCh4W5Sy11Uf4H5A',
					channelName: 'The Japanese Town',
					host: 'youtube',
					id: 'XkPuZqiqN7k',
					livestreamChat: false,
					thumbnailUrl: null,
					title: 'Nostalgic Lofi Hip Hop Beats',
				},
			],
			removeVideo: jest.fn((video: VideoData) => video),
			reorderVideo: jest.fn((video: VideoData, index: number) => {
				return { video, index };
			}),
		};
		const user = userEvent.setup();

		it('renders visible Playlist component', () => {
			render(<Playlist {...props} />);
			const playlist = screen.getByTestId('Playlist');
			expect(playlist).toHaveClass('playlist');
			expect(playlist).toHaveClass('visible');
			expect(playlist).toBeInTheDocument();
			expect(playlist).toMatchSnapshot();
			expect(playlist.firstChild).toBeInTheDocument();
			expect(playlist.firstChild).toHaveClass('container');
		});

		it('renders items from playlist prop', () => {
			render(<Playlist {...props} />);
			const items = screen.getAllByTestId('Item');
			expect(items[0].firstChild).toBeInTheDocument();
			expect(items[0].firstChild).toHaveClass('video');
			expect(items[0].firstChild!.firstChild).toHaveProperty(
				'src',
				props.playlist[0].thumbnailUrl
			);
			expect(items[1].firstChild!.firstChild).toHaveClass('placeholder');
		});

		it('renders passed playlist items', () => {
			render(<Playlist {...props} />);
			const items = screen.getAllByTestId('Item');
			expect(items[0].firstChild).toBeInTheDocument();
			expect(items.length).toBe(2);
			expect(items[0].firstChild).toHaveClass('video');
			expect(items[0].firstChild!.firstChild).toHaveProperty(
				'src',
				props.playlist[0].thumbnailUrl
			);
			expect(items[1].firstChild!.firstChild).toHaveClass('placeholder');
			const paras = screen.getAllByTestId('title');
			expect(paras[1]).toHaveTextContent(props.playlist[1].title);
		});

		it('remove function returns video to be removed, reorder buttons are disabled', async () => {
			render(<Playlist {...props} playlist={[props.playlist[0]]} />);
			const remove = screen.getByTestId('RemoveVid');
			const moveUp = screen.getByTestId('MoveVidUp');
			const moveDown = screen.getByTestId('MoveVidDown');
			expect(remove).toBeInTheDocument();
			expect(remove).toHaveProperty('click');
			expect(moveUp).toHaveProperty('disabled', true);
			expect(moveDown).toHaveProperty('disabled', true);
			await user.click(remove);
			expect(props.removeVideo).toHaveBeenCalledTimes(1);
			expect(props.removeVideo).toHaveBeenCalledWith(props.playlist[0]);
		});

		it('reorder function returns video and its new index on the list', async () => {
			render(<Playlist {...props} />);
			const moveUp = screen.getAllByTestId('MoveVidUp')[1];
			const moveDown = screen.getAllByTestId('MoveVidDown')[1];
			expect(moveUp).toBeInTheDocument();
			expect(moveDown).toBeInTheDocument();
			expect(moveUp).toHaveProperty('click');
			expect(moveDown).toHaveProperty('click');
			expect(moveUp).toHaveProperty('disabled', false);
			expect(moveDown).toHaveProperty('disabled', true);
			await user.click(moveDown);
			expect(props.reorderVideo).not.toHaveBeenCalled();
			await user.click(moveUp);
			expect(props.reorderVideo).toHaveBeenCalledWith(props.playlist[1], 0);
		});
	});
});
