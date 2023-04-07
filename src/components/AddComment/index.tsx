import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axios';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import { fetchComments } from '../../redux/slices/posts';
import { useAppDispatch, useAppSelector } from '../../redux/store';

export const Index: React.FC = () => {
  const { data } = useAppSelector((state) => state.auth);
  const [text, setText] = useState('');
  const [disabled, setDisabled] = useState(true);
  const { id } = useParams(); //Получаем из адресной строки id поста
  const dispatch = useAppDispatch();

  const onSubmit = async () => {
    try {
      setDisabled(true); //блокировка кнопки "Отправить" на случай двойного клика
      await axios.post(`/comment`, { text, post: id });
      setText(''); //очистка поля комментарий
      dispatch(fetchComments(Number(id))); //повторный вызов API получения комментариев для поста
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании комментария');
    }
  };

  //Проверка что символов комментария введено больше 5
  useEffect(() => {
    if (text.length > 5) {
      setDisabled(false); //Активация кнопки "Отправить"
    } else {
      setDisabled(true);
    }
  }, [text]);

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={data ? data.avatarUrl : ''} />
        <div className={styles.form}>
          <TextField
            onChange={(event) => setText(event.target.value)}
            value={text}
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
          />
          <Button disabled={disabled} onClick={onSubmit} variant="contained">
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};
