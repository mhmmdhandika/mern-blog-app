import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface PostTypes {
  _id: string;
  img: string;
  title: string;
  author: string;
  summary: string;
  createdAt: string;
}

function Post({ _id, img, title, author, summary, createdAt }: PostTypes) {
  const hostAPI = import.meta.env.VITE_HOST_API;

  return (
    <article className='grid h-[10rem] grid-cols-2 grid-rows-1 gap-3 overflow-hidden border-2'>
      <Link to={`/blog/post/${_id}`} className='h-[15rem] w-full bg-slate-300'>
        <img
          src={`${hostAPI}/${img}`}
          alt={title}
          className='h-full w-full object-cover'
        />
      </Link>
      <div className='info flex flex-col gap-[0.45rem] py-3 px-1'>
        <Link to={`/blog/post/${_id}`}>
          <h2 className='text-2xl font-semibold'>{title}</h2>
        </Link>
        <div className='flex flex-col gap-3 text-sm text-slate-500'>
          <span className='text-slate-900'>{author}</span>
          <time>{format(new Date(createdAt), 'MMM d, yyy')}</time>
        </div>
      </div>
    </article>
  );
}
export default Post;
