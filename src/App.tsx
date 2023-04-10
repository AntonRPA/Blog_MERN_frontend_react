import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Container from '@mui/material/Container';
// import { lazily } from 'react-lazily';

import { Header } from './components';
import { fetchAuthMe } from './redux/slices/auth';
import { useEffect } from 'react';
import { useAppDispatch } from './redux/store'; //import Типизированный dispatch
const FullPost = React.lazy(() => import(/* webpackChunkName: "FullPost" */ './pages/FullPost')); // Динамический импорт
const Home = React.lazy(() => import(/* webpackChunkName: "Home" */ './pages/Home')); // Динамический импорт
const Registration = React.lazy(
  () => import(/* webpackChunkName: "Registration" */ './pages/Registration'),
); // Динамический импорт
const AddPost = React.lazy(() => import(/* webpackChunkName: "AddPost" */ './pages/AddPost')); // Динамический импорт
const Login = React.lazy(() => import(/* webpackChunkName: "Login" */ './pages/Login')); // Динамический импорт

// const Login = React.lazy(() => import('./pages').then((module) => ({ default: module.Login })));
// const { FullPost } = lazily(() => import('./pages'));

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route
            path="/"
            element={
              <React.Suspense>
                <Home />
              </React.Suspense>
            }>
            <Route path="/posts/popular" element={<Home />} />
            <Route path="/tags/:tag" element={<Home />} />
          </Route>
          <Route
            path="/posts/:id"
            element={
              <React.Suspense>
                <FullPost />
              </React.Suspense>
            }
          />
          <Route
            path="/posts/:id/edit"
            element={
              <React.Suspense fallback={<div>Загрузка...</div>}>
                <AddPost />
              </React.Suspense>
            }
          />
          <Route
            path="/add-post"
            element={
              <React.Suspense fallback={<div>Загрузка...</div>}>
                <AddPost />
              </React.Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <React.Suspense>
                <Login />
              </React.Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <React.Suspense>
                <Registration />
              </React.Suspense>
            }
          />
        </Routes>
      </Container>
    </>
  );
}

export default App;
