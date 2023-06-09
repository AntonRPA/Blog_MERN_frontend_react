import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { TItemsPost, fetchRemovePost } from '../../redux/slices/posts';
import { useAppDispatch } from '../../redux/store';
import { backendUrl } from '../../env';

type TPostProsp = {
  data?: TPost;
  commentsCount?: number;
  children?: any;
  isLoading?: boolean;
  isFullPost?: boolean;
  isEditable?: boolean;
};

type TPost = {
  _id: TItemsPost['_id'];
  createdAt: TItemsPost['createdAt'];
  imageUrl: TItemsPost['imageUrl'];
  tags: TItemsPost['tags'];
  text: TItemsPost['text'];
  title: TItemsPost['title'];
  user: TItemsPost['user'];
  viewsCount: TItemsPost['viewsCount'];
};

export const Post: React.FC<TPostProsp> = ({
  data,
  commentsCount,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const dispatch = useAppDispatch();
  if (isLoading) {
    return <PostSkeleton />;
  }

  const { _id: id, title, imageUrl, user, createdAt, viewsCount, tags } = data as TPost;

  const onClickRemove = () => {
    if (window.confirm('Вы действительно хотите удалить статью?')) {
      dispatch(fetchRemovePost(id));
    }
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl ? backendUrl + imageUrl : ''}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags.map((name, index) => (
              <li key={index}>
                <Link to={`/tag/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
