"use client";

import { generateChatResponse } from "@/utils/action";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

const Chat = () => {
	const [question, setQuestion] = useState<string>("");
	const [message, setMessage] = useState<string[]>([]);
	const { mutate } = useMutation({
		mutationFn: (message: string) => generateChatResponse(message),
	});
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutate(question);
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
("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");
