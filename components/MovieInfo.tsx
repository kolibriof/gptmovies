import React from "react";

const MovieInfo = ({ movie }: any) => {
	const { year, title, description, rating } = movie;

	return (
		<div className='max-w-2xl'>
			<h1 className='text-4xl font-semibold mb-4'>{title}</h1>
			<h2 className='text-2xl font-semibold mb-4'>{year}</h2>
			<p className='leading-loose mb-6'>{description}</p>
			<p className=''>Rating: {rating}</p>
		</div>
	);
};

export default MovieInfo;
