import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';

function EditPage() {
  const hostAPI = import.meta.env.VITE_HOST_API;

  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<{
    title: string;
    content: string;
    files: any;
  }>({
    title: '',
    content: '',
    files: '',
  });

  // load the blog
  useEffect(() => {
    fetch(`${hostAPI}/blog/post/${id}`)
      .then(response => response.json())
      .then(postInfo => {
        setPost({
          ...post,
          title: postInfo.title,
          content: postInfo.content,
        });
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.set('id', id!);
    data.set('title', post.title);
    data.set('content', post.content);
    if (post.files?.[0]) {
      data.set('file', post.files?.[0]);
    }
    const response = await fetch(`${hostAPI}/blog/post`, {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    if (response.ok) navigate(`/blog/post/${id}`);
  };

  return (
    <form
      className='section-space my-3 flex flex-col gap-3'
      onSubmit={e => handleSubmit(e)}
    >
      <input
        type='text'
        placeholder='title'
        className='post-form-input'
        value={post.title}
        onChange={e => setPost({ ...post, title: e.target.value })}
      />
      <input
        type='file'
        onChange={e => setPost({ ...post, files: e.target.files })}
      />
      <ReactQuill
        theme='snow'
        value={post.content}
        onChange={newValue => setPost({ ...post, content: newValue })}
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold,', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }],
            ['link', 'image'],
            ['clean'],
          ],
        }}
        formats={[
          'header',
          'bold',
          'italic',
          'underline',
          'strike',
          'blockquote',
          'list',
          'bullet',
          'indent',
          'link',
          'image',
        ]}
      />
      <button type='submit' className='btn-primary py-1 px-3 font-semibold'>
        Edit post
      </button>
    </form>
  );
}
export default EditPage;
