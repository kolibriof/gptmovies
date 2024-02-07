"use client";

import { FormEvent, useState } from "react";

const Chat = () => {
	const [question, setQuestion] = useState<string>("");
	const [message, setMessage] = useState<string[]>([]);
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(question);
	};
	return (
		<div className='min-h-[calc(100vh-6rem)] flex flex-col justify-between'>
			<div>
				<h2 className='text-5xl'>messages</h2>
			</div>
			<form onSubmit={(e) => handleSubmit(e)} className='max-w-full pt-12'>
				<div className='join w-full'>
					<input
						type='text'
						placeholder='Ask Movies GPT'
						className='input input-bordered join-item w-full'
						value={question}
						required
						onChange={(e) => setQuestion(e.target.value)}
					/>
					<button className='join-item btn btn-primary'>Submit Question</button>
				</div>
			</form>
		</div>
	);
};

export default Chat;