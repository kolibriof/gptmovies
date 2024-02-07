import React from "react";
import { WiStars } from "react-icons/wi";
import ThemeToggle from "./ThemeToggle";

const SideBarHeader = () => {
	return (
		<div className='flex items-center mb-4 gap-4 px-4'>
			<WiStars className='w-10 h-10 text-primary' />
			<h2 className='text-xl font-extrabold text-primary mr-auto'>GPTMovies</h2>
			<ThemeToggle />
		</div>
	);
};

export default SideBarHeader;
