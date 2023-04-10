import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Post } from '../components/Post';
import { AddComment } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import axios from '../axios';
import ReactMarkdown from 'react-markdown';
import { TItemsPost, fetchComments } from '../redux/slices/posts';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { selectIsAuth } from '../redux/slices/auth';

const FullPost: React.FC = () => {
  const [data, setData] = useState<TItemsPost>();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { comments } = useAppSelector((state) => state.posts);
  const isCommentLoading = comments.status === 'loading';
  const isAuth = useAppSelector(selectIsAuth);

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then((res) => {
          setData(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.warn(err);
          alert('Ошибка получения данных статьи');
        });
      dispatch(fetchComments(id));
    }
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      {data ? (
        <Post data={data} commentsCount={comments.items.length} isFullPost>
          <ReactMarkdown children={data.text} />
        </Post>
      ) : (
        ''
      )}

      <CommentsBlock items={comments.items} isLoading={isCommentLoading}>
        {/* //Если авторизован, то видит форму для добавления комментария */}
        {isAuth ? (
          <AddComment />
        ) : (
          <div style={{ padding: '15px' }}>Авторизуйтесь, чтобы написать комментарий</div>
        )}
      </CommentsBlock>
    </>
  );
};

export default FullPost;
