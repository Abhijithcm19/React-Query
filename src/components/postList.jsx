import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPosts, fetchTags, addPost } from "../api/api";

const PostList = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const {
    data: postData,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", { page }],
    queryFn: () => fetchPosts(page),
    staleTime: 1000 * 60 *5
  });
  const { data: tagData } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const {
    mutate,
    isError: isPostError,
    isPending,
    error: postError,
    reset,
  } = useMutation({
    mutationFn: addPost,
    onMutate: () => {
      return { id: 1 };
    },
    onSuccess: (data, variables, contest) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        exact: true,
        // predicate: (query)=>
        // query.queryKey[0]=== "post" && query.querKey[1].page>=2
      });
    },
    // onError: (error,variables,contest)=>{},
    // onSettled: (data,error,variables,context)=>{

    // }
  });

  const handelSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const tags = Array.from(formData.keys()).filter(
      (key) => formData.get(key) === "on"
    );
    if (!title || !tags) return;
    mutate({ id: postData?.data?.length + 1, title, tags });
    e.target.reset();
  };

  return (
    <div className="container">
      <form onSubmit={handelSubmit}>
        <input
          type="text"
          placeholder="Enter your post..."
          className="postbox"
          name="title"
        />
        <div className="tags">
          {tagData?.map((tag) => {
            return (
              <div key={tag}>
                <input name={tag} id={tag} type="checkbox" />
                <label htmlFor={tag}>{tag}</label>
              </div>
            );
          })}
        </div>
        <button>Post</button>
      </form>
      {isLoading && isError && <p>Loading...</p>}
      {isError && <p>{error?.message}</p>}
      {isPostError && <p>unable to Post</p>}


      <div className="pages">
        <button
          onClick={() => setPage((oldPage) => Math.max(oldPage - 1, 0))}
          disabled={!postData?.prev}
        >
          Previous page
        </button>
        <span>{page}</span>
        <button
          onClick={() => {
            setPage((oldPage) => oldPage + 1);
          }}
          disabled={!postData?.next}
        >
          next Page
        </button>
      </div>

      {postData &&
        postData?.data?.map((post) => (
          <div key={post.id} className="post">
            <div>{post.title}</div>
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        ))}
    </div>
  );
};

export default PostList;
