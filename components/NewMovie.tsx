"use client";

import React from "react";
import MovieInfo from "./MovieInfo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IoMdInformationCircleOutline } from "react-icons/io";
import {
	createNewMovie,
	generateMovieResponse,
	subtractTokens,
} from "@/utils/actions";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

const NewMovie = () => {
	const queryClient = useQueryClient();
	const { userId } = useAuth();
	const {
		mutate,
		isPending,
		data: movie,
	} = useMutation({
		mutationFn: async (destination) => {
			const newMovie = await generateMovieResponse(destination);
			if (newMovie) {
				const newTokens = await subtractTokens(userId, newMovie.tokens);
				if (newMovie.id) {
					// true if the movie is already in the db
					return newMovie;
				}
				await createNewMovie(newMovie.movie);
				queryClient.invalidateQueries({ queryKey: ["movies"] });
				toast.success(`${newTokens} tokens left.`);
				return newMovie.movie;
			}
			toast.error("No movies found..");
			return null;
		},
	});
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const destination = Object.fromEntries(formData.entries());
		mutate(destination as any);
	};
	if (isPending) {
		return <span className='loading loading-lg'></span>;
	}
	return (
		<>
			<form onSubmit={(e) => handleSubmit(e)} className='max-w-2xl'>
				<h2 className="flex gap-1 items-center mb-4 hover:after:content-['Generates_random_movie_based_on_the_filters..'] hover:after:bg-primary hover:after:shadow-xl hover:after:text-white hover:after:p-2 hover:after:rounded-lg hover:after:absolute hover:after:top-2">
					<span className='inline-block'>
						<IoMdInformationCircleOutline />
					</span>
					Generate a new movie..
				</h2>
				<div className='join w-full'>
					<input
						type='text'
						className='input input-bordered join-item w-full'
						placeholder='Genre'
						name='genre'
						required
					/>
					<input
						type='text'
						className='input input-bordered join-item w-full'
						placeholder='Year'
						name='year'
						required
					/>
					<button className='btn btn-primary join-item' type='submit'>
						Generate movie
					</button>
				</div>
			</form>
			<div className='mt-16'>{movie ? <MovieInfo movie={movie} /> : null}</div>
		</>
	);
};

export default NewMovie;
