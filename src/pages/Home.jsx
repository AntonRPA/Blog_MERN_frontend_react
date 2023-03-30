import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags, fetchPostsTag, setTypePosts } from '../redux/slices/posts';

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags, typePosts } = useSelector((state) => state.posts);
  const isPostLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const location = useLocation();
  const { tag } = useParams(); //получаем tag из ссылки браузера

  const changeTypePost = (type) => {
    dispatch(setTypePosts(type));
  };

  useEffect(() => {
    if (location.pathname === '/posts/popular') {
      changeTypePost('popular');
    }
  }, []);

  React.useEffect(() => {
    //Если tag не false, то загружаем посты по тегу. Иначе загружаем посты по сортировке
    if (tag) {
      dispatch(fetchPostsTag(tag));
    } else {
      dispatch(fetchPosts(typePosts));
    }
    console.log('typePosts: ', typePosts);

    dispatch(fetchTags('')); //получаем 5 тегов для колонки справа
  }, [typePosts]);

  return (
    <>
      {tag ? (
        <h3>{tag}</h3>
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
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            ),
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
