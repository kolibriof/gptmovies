"use server";

import OpenAI from "openai";

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

export const getExistingMovie = async ({ genre, year }: any) => {
	return null;
};

export const generateMovieResponse = async ({ genre, year }: any) => {
	return null;
};

export const createNewMovie = async (movie: any) => {
	return null;
};
