import Link from "next/link";
import React from "react";

const MovieCard = ({ movie }: any) => {
	const { title, id, year, rating } = movie;
	return (
		<Link
			href={`/movies/${id}`}
			className='card card-compact rounded-xl bg-base-100'>
			<div className='card-body items-center text-center'>
				<h2 className='card-title text-center'>
					{title}, {year}
				</h2>
				<p className=''>Rating: {rating}/10</p>
			</div>
		</Link>
	);
};

export default MovieCard;
