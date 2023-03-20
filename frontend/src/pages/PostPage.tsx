import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
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

  const handleDelete = async () => {
    const confirm = Swal.fire({
      title: 'You sure?',
      text: 'Are you sure want to delete this blog?',
      icon: 'warning',
      showCancelButton: true,
    });

    const response = await confirm;

    // if user is sure to delete a blog
    if (response.isConfirmed) {
      fetch(`${hostAPI}/blog/post`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
        credentials: 'include',
      });
    }
  };

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
      {userInfo?.id === post?.author._id && (
        <div className='my-3 flex items-center justify-center gap-2'>
          {/* edit button */}
          <Link
            to={`/blog/edit/${post?._id}`}
            className='flex w-fit items-center justify-center gap-1 rounded bg-slate-800 px-3 py-1 text-sm text-white'
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
          {/* delete button */}
          <button
            className='rounded bg-red-500 p-1 text-white'
            onClick={handleDelete}
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
                d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
              />
            </svg>
          </button>
        </div>
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
