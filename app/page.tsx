'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function App() {
	const { push } = useRouter();

	useEffect(() => {
		push('/watch');
	}, [push]);

	return <div></div>;
}
