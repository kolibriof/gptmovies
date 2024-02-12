import NewMovie from "@/components/NewMovie";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";

const NewMoviePage = () => {
	const queryClient = new QueryClient();
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NewMovie />
		</HydrationBoundary>
	);
};

export default NewMoviePage;
