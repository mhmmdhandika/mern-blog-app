import Post from '../components/Post';
import { useEffect, useState } from 'react';

function Home() {
  const hostAPI = import.meta.env.VITE_HOST_API;

  const [posts, setPosts] = useState<
    | [
        {
          _id: string;
          title: string;
          author: {
            name: string;
            username: string;
          };
          createdAt: string;
          cover: string;
          summary: string;
        }
      ]
    | []
  >([]);

  useEffect(() => {
    fetch(`${hostAPI}/blog/posts`)
      .then(response => response.json())
      .then(posts => setPosts(posts));
  }, []);

  return (
    <main className='section-space flex flex-col gap-3 p-3'>
      {posts.length > 0 &&
        posts.map((post, index) => (
          <Post
            _id={post._id}
            title={post.title}
            author={post.author.name}
            createdAt={post.createdAt}
            img={post.cover}
            summary={post.summary}
            key={index}
          />
        ))}
    </main>
  );
}
export default Home;
