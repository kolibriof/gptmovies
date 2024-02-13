import React from "react";
import MovieCard from "./MovieCard";

const MoviesList = ({ data }: any) => {
	if (data.length === 0) {
		return <h4 className='text-lg'>There are no movies yet. </h4>;
	}
	return (
		<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-8'>
			{data.map((movie: any) => {
				return <MovieCard key={movie.id} movie={movie} />;
			})}
		</div>
	);
};

export default MoviesList;
