"use client";

import React from "react";
import MovieInfo from "./MovieInfo";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	createNewMovie,
	generateMovieResponse,
	getExistingMovie,
} from "@/utils/actions";
import toast from "react-hot-toast";

const NewMovie = () => {
	const {
		mutate,
		isPending,
		data: movie,
	} = useMutation({
		mutationFn: async (destination) => {
			const newMovie = await generateMovieResponse(destination);
			if (newMovie) {
				return newMovie;
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
				<h2 className='mb-4'>Generate a new movie..</h2>
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
						name='Year'
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
