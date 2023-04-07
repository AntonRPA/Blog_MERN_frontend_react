import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import axios from '../axios';
import ReactMarkdown from 'react-markdown';
import { TItemsPost, fetchComments } from '../redux/slices/posts';
import { useAppDispatch, useAppSelector } from '../redux/store';

export const FullPost: React.FC = () => {
  const [data, setData] = useState<TItemsPost>();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { comments } = useAppSelector((state) => state.posts);
  const isCommentLoading = comments.status === 'loading';

  useEffect(() => {
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
    dispatch(fetchComments(Number(id)));
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
        {/* // items={[
        //   {
        //     user: {
        //       fullName: 'Вася Пупкин',
        //       avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
        //     },
        //     text: 'Это тестовый комментарий 555555',
        //   },
        //   {
        //     user: {
        //       fullName: 'Иван Иванов',
        //       avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
        //     },
        //     text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
        //   },
        // ]}
        // isLoading={false}> */}
        <Index />
      </CommentsBlock>
    </>
  );
};
