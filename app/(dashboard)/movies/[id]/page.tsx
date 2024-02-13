import MovieInfo from "@/components/MovieInfo";
import { getSingleMovie } from "@/utils/actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=`;

const SingleMoviePage = async ({ params }: any) => {
	const movie = await getSingleMovie(params.id);
	if (!movie) {
		redirect("/movies");
	}
	const { data } = await axios(`${url}${movie.title}`);
	const movieImg = data?.results[0]?.urls?.raw;
	return (
		<div>
			<Link href='/movies' className='btn btn-secondary mb-12'>
				Back to movies
			</Link>
			{movieImg ? (
				<div>
					<Image
						src={movieImg}
						width={300}
						height={300}
						className='rounded-xl shadow-xl mb-16 h-96 w-96 object-cover'
						alt={movie.title}
						priority
					/>
				</div>
			) : null}
			<MovieInfo movie={movie} />
		</div>
	);
};

export default SingleMoviePage;
