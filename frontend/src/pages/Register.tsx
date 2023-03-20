import { useContext, useState } from 'react';
import type { FormEvent } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Toast from '../components/Toast';

function Register() {
  const hostAPI = import.meta.env.VITE_HOST_API;

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setUserInfo } = useContext(UserContext);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch(`${hostAPI}/user/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // store user data to user context
      setUserInfo(data);
      // show alert
      Toast.fire({
        icon: 'success',
        title: 'Register successfully',
      });
      // if successfully redirect to home page
      navigate('/');
    } else {
      Swal.fire({
        title: 'Register failed!',
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
        <h1 className='auth-title'>Register</h1>
      </div>
      <div>
        <input
          type='text'
          name='name'
          placeholder='Name'
          className='auth-input'
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type='text'
          name='username'
          placeholder='Username'
          className='auth-input'
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
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
          required
        />
      </div>
      <button type='submit' className='auth-submit'>
        Submit
      </button>
    </form>
  );
}
export default Register;
