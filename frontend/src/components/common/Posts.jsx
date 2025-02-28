import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType, userName, userId}) => {

	const getPostEndpoint = () => {
		switch (feedType) {
			case "foryou":
				return "/api/post/all";
			case "following":
				return "/api/post/following";
			case "posts":
				return `/api/post/user/${userName}`;
			case "likes":
				return `/api/post/likes/${userId}`;
			default:
				return "/api/post/all";
		}
	};
	const POST_ENDPOINT = getPostEndpoint();

	const { isLoading, data: posts, refetch, isRefetching } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "An error occurred while fetching posts");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch, userName]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;