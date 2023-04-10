import React, { useCallback, useEffect, useRef } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import {
  fetchPosts,
  fetchTags,
  fetchPostsTag,
  setTypePosts,
  fetchCommentsQuantity,
} from '../redux/slices/posts';
import { useAppDispatch, useAppSelector } from '../redux/store';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.auth.data);
  const { posts, tags, typePosts, comments } = useAppSelector((state) => state.posts);
  const isPostLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentLoading = comments.status === 'loading';
  const location = useLocation();
  const firstRender = useRef(true); //Проверка первый рендер или нет. Нужно для проверки пути в адресной строке
  const { tag } = useParams(); //получаем tag из ссылки браузера

  const changeTypePost = (type: string) => {
    dispatch(setTypePosts(type));
  };

  React.useEffect(() => {
    if (firstRender.current) {
      //Проверяем URL страницы и в зависимости от ссылки меняем state
      if (location.pathname === '/posts/popular') {
        changeTypePost('popular');
      }
      if (tag) {
        changeTypePost(tag);
      }
      firstRender.current = false;
    } else {
      //Если tag не false, то загружаем посты по тегу. Иначе загружаем посты по сортировке
      if (tag) {
        dispatch(fetchPostsTag(tag));
      } else {
        dispatch(fetchPosts(typePosts));
      }

      dispatch(fetchTags()); //получаем 5 тегов для колонки справа
      dispatch(fetchCommentsQuantity(5)); //получаем 5 комментариев последних
    }
  }, [typePosts]);

  // console.log(tags.items);
  // console.log(comments.items);

  return (
    <>
      {tag ? (
        <h3>#{tag}</h3>
      ) : (
        <Tabs
          style={{ marginBottom: 15 }}
          value={typePosts === 'popular' ? 1 : 0}
          aria-label="basic tabs example">
          <Tab component={Link} to={`/`} onClick={() => changeTypePost('')} label="Новые" />
          <Tab
            component={Link} //Вместо тега <Link></Link>. Т.е. можем не оборачивать в тег
            to={`/posts/popular`}
            onClick={() => changeTypePost('popular')}
            label="Популярные"
          />
        </Tabs>
      )}

      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostLoading ? (
              <Post isLoading={true} key={index} />
            ) : (
              <Post
                key={obj._id}
                data={obj}
                commentsCount={obj.commentsCount}
                isEditable={userData?._id === obj.user._id}
              />
            ),
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock items={comments.items} isLoading={isCommentLoading} />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
