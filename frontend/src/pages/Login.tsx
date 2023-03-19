import { useContext, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';

function Login() {
  const hostAPI = import.meta.env.VITE_HOST_API;

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUserInfo } = useContext(UserContext);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch(`${hostAPI}/user/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok) {
      // redirect to home page
      setUserInfo(data);
      navigate('/');
    } else {
      Swal.fire({
        title: 'Login failed!',
        text: data.message,
        icon: 'error',
        timer: 5000,
      });
    }
  };

  return (
    <form
      className='mx-auto mt-24 flex w-fit flex-col gap-3'
      onSubmit={e => handleSubmit(e)}
    >
      <div>
        <h1 className='auth-title'>Login</h1>
      </div>
      <div>
        <input
          type='text'
          name='username'
          placeholder='Username'
          className='auth-input'
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type='password'
          name='password'
          placeholder='Password'
          className='auth-input'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button type='submit' className='auth-submit'>
        Submit
      </button>
    </form>
  );
}
export default Login;
