"use server";

import OpenAI from "openai";
import prisma from "./db";

export interface MessageToGPT {
	role: string;
	content: string;
}

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const generateChatResponse = async (chatMessages: MessageToGPT) => {
	try {
		const response = await openai.chat.completions.create({
			messages: [
				{
					role: "system",
					content: "You are a helpful assistant.",
				},
				...(chatMessages as any),
			],
			model: "gpt-3.5-turbo-0125",
			temperature: 0,
		});
		console.log(response.choices[0].message);
		console.log(response);

		return response.choices[0].message;
	} catch (error) {
		return null;
	}
};

export const getExistingMovie = async ({ title, year }: any) => {
	return prisma.movie.findUnique({
		where: {
			title_year: {
				title,
				year,
			},
		},
	});
};

export const generateMovieResponse = async ({ genre, year }: any) => {
	try {
		const resp = await openai.chat.completions.create({
			messages: [
				{
					role: "system",
					content: "You are the movie guru.",
				},
				{
					role: "user",
					content: `Find a movie with exact genre - ${genre}, and exact year - ${year} based on the data you have. Don't provide real time data. Up to year 2021. 
Find one random movie. Once you have the data, respond in the JSON format like that:
{
  "movie": {
    "year": year,
    "title": "title of the movie",
    "description": "short description of the movie",
    "rating": "rating"
  }
}
"ratings" should include only 1 rating.
If you can't find info on exact movie or movie does not exist or something else goes wrong,  return { "movie": null }, with no additional characters.`,
				},
			],
			model: "gpt-3.5-turbo-0125",
			temperature: 0,
		});

		if (resp.choices[0].message.content !== null) {
			const movieData = JSON.parse(resp.choices[0].message.content);
			const movieExists = await getExistingMovie({
				title: movieData.movie.title,
				year: movieData.movie.year,
			});
			if (!movieData.movie) {
				return null;
			}
			if (movieExists) {
				const { id, year, title, description, rating } = movieExists;
				return {
					id,
					year,
					title,
					description,
					rating,
				};
			}
			return movieData.movie;
		}
		console.log(resp);
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const createNewMovie = async (movie: any) => {
	return prisma.movie.create({
		data: movie,
	});
};

export const getAllMovies = async () => {
	const allMovies = prisma.movie.findMany({
		orderBy: {
			year: "desc",
		},
	});
	if (allMovies) {
		return allMovies;
	}
	return null;
};

export const getSingleMovie = async (id: any) => {
	const singleMovie = prisma.movie.findUnique({
		where: {
			id,
		},
	});
	if (singleMovie) {
		return singleMovie;
	}
	return null;
};
