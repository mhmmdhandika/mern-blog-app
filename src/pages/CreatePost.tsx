import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Swal from 'sweetalert2';

function CreatePost() {
  const hostAPI = import.meta.env.VITE_HOST_API;

  const [post, setPost] = useState<{
    title: string;
    content: string;
    files: any;
  }>({
    title: '',
    content: '',
    files: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // check if file is empty
    if (post.files.length == 0) {
      Swal.fire({
        title: 'File image input is empty',
        text: 'Please input one image for your blog cover',
        icon: 'warning',
        timer: 5000,
      });
      return;
    }

    // check if blog content is empty
    // using this regex because react quill return <p><br></p> in empty input
    if (post.content.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
      Swal.fire({
        title: 'Blog content is empty',
        text: 'Please fill out blog content',
        icon: 'warning',
        timer: 5000,
      });
      return;
    }

    const data = new FormData();
    data.set('title', post.title);
    data.set('content', post.content);
    data.set('file', post.files[0]);

    const response = await fetch(`${hostAPI}/blog/create`, {
      method: 'POST',
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      navigate('/');
    }
  };

  return (
    <form
      className='section-space mt-3 flex flex-col gap-3'
      onSubmit={e => handleSubmit(e)}
    >
      <input
        type='text'
        placeholder='title'
        className='post-form-input'
        value={post.title}
        onChange={e => setPost({ ...post, title: e.target.value })}
        required
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
        Create post
      </button>
    </form>
  );
}

export default CreatePost;
