"use client";

import React from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IoMdInformationCircleOutline } from "react-icons/io";
import {
	GetSuggestedMovie,
	createNewMovie,
	generateMovieResponse,
	subtractTokens,
} from "@/utils/actions";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import MovieInfo from "@/components/MovieInfo";

const SuggestMovie = () => {
	const queryClient = useQueryClient();
	const { userId } = useAuth();
	const {
		mutate,
		isPending,
		data: movie,
	} = useMutation({
		mutationFn: async (destination: string[]) => {
			const suggestedMovie = await GetSuggestedMovie(destination);
			if (suggestedMovie) {
				if (suggestedMovie.tokens === "NOT_ENOUGH") {
					toast.error("Not enough tokens.");
				}
				const newTokens = await subtractTokens(userId, suggestedMovie.tokens);
				await createNewMovie(suggestedMovie.movie);
				queryClient.invalidateQueries({ queryKey: ["movies"] });
				toast.success(`${newTokens} tokens left.`);
				return suggestedMovie.movie;
			}
			toast.error("No movies found..");
			return null;
		},
	});
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const destination = Object.fromEntries(formData.entries());

		mutate(Object.values(destination) as string[]);
	};
	if (isPending) {
		return <span className='loading loading-lg'></span>;
	}
	return (
		<>
			<form onSubmit={(e) => handleSubmit(e)} className='max-w-2xl'>
				<h2 className="flex gap-1 items-center mb-4 hover:after:content-['Generates_suggested_movie_based_on_provided_movies.'] hover:after:bg-primary hover:after:shadow-xl hover:after:text-white hover:after:p-2 hover:after:rounded-lg hover:after:absolute hover:after:top-2">
					<span className='inline-block'>
						<IoMdInformationCircleOutline />
					</span>
					Please provide three movies that you liked.
				</h2>
				<div className='join w-full'>
					<input
						type='text'
						className='input input-bordered join-item w-full'
						placeholder='First movie'
						name='firstmovie'
						required
					/>
					<input
						type='text'
						className='input input-bordered join-item w-full'
						placeholder='Second movie'
						name='secondmovie'
						required
					/>
					<input
						type='text'
						className='input input-bordered join-item w-full'
						placeholder='Third movie'
						name='thirdmovie'
						required
					/>
					<button className='btn btn-primary join-item' type='submit'>
						Suggest movie
					</button>
				</div>
			</form>
			<div className='mt-16'>{movie ? <MovieInfo movie={movie} /> : null}</div>
		</>
	);
};

export default SuggestMovie;
