'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Custom500 = () => {
	const [countdown, setCountdown] = useState(5);
	const router = useRouter();

	useEffect(() => {
		setTimeout(() => {
			if (countdown > 0) setCountdown(countdown - 1);
		}, 1000);
	}, [countdown]);

	useEffect(() => {
		if (countdown === 0) router.push('/watch');
	}, [countdown, router]);

	return (
		<div className='my-5 text-center d-flex flex-column gap-3'>
			<h1 className='fw-bold text-danger'>500</h1>
			<h2>Server Side Error Occurred</h2>
			<h3>
				Redirecting to{' '}
				<Link href='/watch' className='fw-bold text-primary'>
					Watch
				</Link>{' '}
				page in <strong className='text-warning'>{countdown} seconds</strong>
			</h3>
		</div>
	);
};

export default Custom500;
