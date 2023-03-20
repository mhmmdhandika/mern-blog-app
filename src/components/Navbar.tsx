import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Toast from './Toast';

function Navbar() {
  const hostAPI = import.meta.env.VITE_HOST_API;

  const navigate = useNavigate();

  const { userInfo, setUserInfo } = useContext(UserContext);

  // get the user profile
  useEffect(() => {
    fetch(`${hostAPI}/user/profile`, {
      credentials: 'include',
    }).then(resp => {
      resp.json().then(userInfo => {
        setUserInfo(userInfo?.username);
      });
    });
  }, []);

  const handleLogout = () => {
    fetch(`${hostAPI}/user/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    // reset user info
    setUserInfo(null);
    // show alert
    Toast.fire({
      icon: 'success',
      title: 'Logout successfully',
    });
    // redirect to home
    navigate('/');
  };

  return (
    <header className='section-space flex items-center justify-between gap-5 border-b py-2'>
      <Link to='/' className='text-xl font-medium'>
        My Blog
      </Link>
      <nav className='flex gap-3'>
        {userInfo?.username ? (
          <>
            <Link to='/create'>Create new post</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
export default Navbar;
