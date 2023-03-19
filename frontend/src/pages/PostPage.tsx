import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function PostPage() {
  const hostAPI = import.meta.env.VITE_HOST_API;

  const { userInfo } = useContext(UserContext);

  const [post, setPost] = useState<{
    _id: string;
    title: string;
    summary: string;
    content: string;
    cover: string;
    author: {
      _id: string;
      name: string;
      username: string;
    };
    createdAt: string;
    updatedAt: string;
  } | null>(null);

  // get an id from the post
  const { id } = useParams();

  useEffect(() => {
    fetch(`${hostAPI}/blog/post/${id}`)
      .then(response => response.json())
      .then(postInfo => {
        setPost(postInfo);
      });
  }, []);

  return (
    <article className='section-space mt-3'>
      <h1 className='mt-10 text-center text-3xl font-semibold'>
        {post?.title}
      </h1>
      <time className='my-2 block text-center text-sm text-gray-600'>
        {post?.createdAt}
      </time>
      <p className='text-center font-semibold'>by @{post?.author.username}</p>
      {userInfo.id === post?.author._id && (
        <Link
          to={`/blog/edit/${post?._id}`}
          className='my-3 mx-auto flex w-fit items-center justify-center gap-1 rounded bg-slate-800 px-3 py-1 text-sm text-white'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
            />
          </svg>
          <div>Edit this blog</div>
        </Link>
      )}
      <div className='my-4 h-[20rem] bg-slate-300'>
        <img
          src={`http://localhost:4000/${post?.cover}`}
          alt={post?.title}
          className='h-full w-full object-cover'
        />
      </div>
      <div dangerouslySetInnerHTML={{ __html: post?.content! }} />
    </article>
  );
}
export default PostPage;
