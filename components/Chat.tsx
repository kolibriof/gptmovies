"use client";

import { MessageToGPT, generateChatResponse } from "@/utils/actions";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { RiRobot2Fill, RiUser3Fill } from "react-icons/ri";

const Chat = () => {
	const [question, setQuestion] = useState<string>("");
	const [messages, setMessages] = useState([]);
	const { mutate, isPending } = useMutation({
		mutationFn: (q: MessageToGPT) =>
			generateChatResponse(messages ? ([...messages, q] as any) : ""),
		onSuccess: (data) => {
			if (!data) {
				toast.error("There was some error.");
				return;
			}
			setMessages((prev) => (prev ? ([...prev, data] as any) : ""));
		},
	});
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		let tempQuestion = {
			role: "user",
			content: question,
		};
		mutate(tempQuestion);
		setMessages((prev) => (prev ? ([...prev, tempQuestion] as any) : ""));
		setQuestion("");
	};
	console.log(messages);
	return (
		<div className='min-h-[calc(100vh-6rem)] flex flex-col justify-between'>
			<div className='flex flex-col gap-3 w-full overflow-y-auto'>
				{messages ? (
					messages.map((message: MessageToGPT) => {
						return (
							<div
								className={`flex flex-row gap-3 items-center text-xl p-3 ${
									message.role === "assistant" && `bg-base-100 rounded-lg`
								}`}>
								<div className='text-red'>
									{message.role === "assistant" ? (
										<RiRobot2Fill className='text-white bg-primary box-content p-1 rounded-lg ' />
									) : (
										<RiUser3Fill className='text-white bg-secondary box-content p-1 rounded-lg ' />
									)}
								</div>
								<div
									className={
										message.role === "assistant"
											? `bg-gradient-to-r from-blue-600 to-violet-500 inline-block text-transparent bg-clip-text`
											: ``
									}>
									{message.content}
								</div>
							</div>
						);
					})
				) : (
					<h2 className='text-xl'>No messages</h2>
				)}
				{isPending ? <span className='loading'></span> : null}
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
					<button className='join-item btn btn-primary' disabled={isPending}>
						Submit Question
					</button>
				</div>
			</form>
		</div>
	);
};

export default Chat;
