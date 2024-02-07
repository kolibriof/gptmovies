import Link from "next/link";

const links = [
	{ href: "/chat", label: "Chat" },
	{ href: "/movies", label: "movies" },
	{ href: "/movies/new-movie", label: "New Movie" },
	{ href: "/profile", label: "profile" },
];

const NavLinks = () => {
	return (
		<div className='menu text-base-content'>
			{links.map((link: (typeof links)[0]) => {
				return (
					<li key={link.href} className='capitalize font-semibold'>
						<Link href={link.href}>{link.label}</Link>
					</li>
				);
			})}
		</div>
	);
};

export default NavLinks;
