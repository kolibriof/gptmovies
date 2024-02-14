"use server";

import OpenAI from "openai";
import prisma from "./db";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import toast from "react-hot-toast";

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
			max_tokens: 100,
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
		console.log(chatMessages);
		console.log(response);

		return {
			message: response.choices[0].message,
			tokens: response.usage?.total_tokens,
		};
	} catch (error) {
		console.log(error);

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
		const { userId } = auth();
		const currentTokens = await fetchUserTokensById(userId);
		if (currentTokens) {
			if (currentTokens < 300) {
				toast.error("Token balance is too low.");
				return null;
			}
		}
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
					tokens: resp.usage?.total_tokens,
					id,
					year,
					title,
					description,
					rating,
				};
			}
			return { movie: movieData.movie, tokens: resp.usage?.total_tokens };
		}
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

export const fetchUserTokensById = async (clerkId: any) => {
	const res = await prisma.token.findUnique({
		where: {
			clerkId,
		},
	});
	return res?.tokens;
};

export const generateUserTokensForId = async (clerkId: any) => {
	const result = await prisma.token.create({
		data: {
			clerkId,
		},
	});
	return result?.tokens;
};

export const fetchOrGenerateTokens = async (clerkId: any) => {
	const res = await fetchUserTokensById(clerkId);
	if (res) {
		return res;
	}
	return await generateUserTokensForId(clerkId);
};

export const subtractTokens = async (clerkId: any, tokens: any) => {
	const result = await prisma.token.update({
		where: {
			clerkId,
		},
		data: {
			tokens: {
				decrement: tokens,
			},
		},
	});
	revalidatePath("/profile");
	return result.tokens;
};

export const GetSuggestedMovie = async (givenMovies: string[]) => {
	const { userId } = auth();
	const currentTokens = await fetchUserTokensById(userId);

	if (currentTokens! < 200) {
		return { tokens: "NOT_ENOUGH" };
	}

	if (givenMovies.length < 3) {
		toast.error("Please provide 3 movies.");
		return;
	}
	try {
		const resp = await openai.chat.completions.create({
			messages: [
				{
					role: "system",
					content: "You are the movie guru.",
				},
				{
					role: "user",
					content: `Find a similar movie based on these three movies - ${givenMovies[0]}, ${givenMovies[1]}, ${givenMovies[2]}.
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
			if (!movieData.movie) {
				return null;
			}
			return { movie: movieData.movie, tokens: resp.usage?.total_tokens };
		}
	} catch (error) {
		console.log(error);
		return null;
	}
};
