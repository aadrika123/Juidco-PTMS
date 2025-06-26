// AutoLogout.js
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slice/slice';
import { useNavigate } from 'react-router-dom';

const AutoLogout = ({ children, timeout = 30 * 60 * 1000 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timerRef = useRef();

  const clearAll = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(';').forEach(c => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
  };

  const logoutUser = () => {
    dispatch(logout());
    clearAll();
    navigate('/');
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logoutUser, timeout);
  };

  useEffect(() => {
    resetTimer();
    const handleActivity = () => resetTimer();

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, handleActivity));

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearTimeout(timerRef.current);
    };
  }, []);

  return children;
};

export default AutoLogout;
