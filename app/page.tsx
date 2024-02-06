export default function Home() {
	return (
		<div className='hero min-h-screen bg-base-200'>
			<div className='hero-content text-center'>
				<div className='max-w-md'>
					<h1 className='text-7xl font-bold bg-gradient-to-r from-blue-600 to-violet-500 inline-block text-transparent bg-clip-text'>
						GPTMovies
					</h1>
					<p className='py-6 text-blue-600 text-lg '>
						GPTMovies: AI-driven platform for personalized movie
						recommendations. Input your favorite genre and actors for tailored
						suggestions based on reviews and ratings. Intuitive interface and
						adaptive learning enhance the movie-watching experience.
					</p>
					<button className='btn bg-gradient-to-r from-blue-600 to-violet-500 text-white'>
						Get Started
					</button>
				</div>
			</div>
		</div>
	);
}
