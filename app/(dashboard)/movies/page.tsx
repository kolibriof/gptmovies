import Chat from "@/components/Chat";
import React from "react";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import MoviesPage from "@/components/MoviesPage";
import { getAllMovies } from "@/utils/actions";

const AllMoviesPage = async () => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["movies"],
		queryFn: () => getAllMovies(),
	});
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<MoviesPage />
		</HydrationBoundary>
	);
};

export default AllMoviesPage;
