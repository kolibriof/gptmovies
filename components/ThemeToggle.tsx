"use client";
import { useState } from "react";
import { FaMoon } from "react-icons/fa";

enum THEMES {
	DARK = "sunset",
	LIGHT = "autumn",
}
const ThemeToggle = () => {
	const [theme, setTheme] = useState<THEMES>(THEMES.DARK);
	const handleThemeToggle = () => {
		if (theme === THEMES.DARK) {
			setTheme(THEMES.LIGHT);
		} else {
			setTheme(THEMES.DARK);
		}
		document.documentElement.setAttribute("data-theme", theme);
	};
	return (
		<button
			className={`btn btn-primary btn-sm rounded-full border-2 border-primary ${
				theme === THEMES.DARK ? ` bg-transparent` : ""
			}`}
			onClick={() => handleThemeToggle()}>
			{theme === THEMES.LIGHT ? (
				<FaMoon />
			) : (
				<FaMoon className='text-primary' />
			)}
		</button>
	);
};

export default ThemeToggle;
