"use client";

import { getAllMovies } from "@/utils/actions";
import { useQuery } from "@tanstack/react-query";
import MoviesList from "./MoviesList";

const MoviesPage = () => {
	const { data, isPending } = useQuery({
		queryKey: ["movies"],
		queryFn: () => getAllMovies(),
	});
	return (
		<>
			{isPending ? (
				<span className='loading loading-md'></span>
			) : (
				<MoviesList data={data} />
			)}
		</>
	);
};

export default MoviesPage;
