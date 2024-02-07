import React from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: any) {
	return (
		<>
			<Toaster position='top-center' />
			{children}
		</>
	);
}
