import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from '../../axios';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { selectIsAuth } from '../../redux/slices/auth';
import { backendUrl } from '../../env';
import { useAppSelector } from '../../redux/store';

export const AddPost: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useAppSelector(selectIsAuth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [disabled, setDisabled] = useState(true);
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const isEditing = Boolean(id); //Если редактируем статью

  //Активация кнопки "Опубликовать" если все формы заполнены
  useEffect(() => {
    if (title.length > 5 && tags.length > 2 && text.length > 10) setDisabled(false);
    else setDisabled(true);
  }, [text, title, tags]);

  const handleChangeFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const formData = new FormData();
      const file = event.target.files?.[0];
      if (file) {
        formData.append('image', file);
      }
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла');
    }
  };
  //
  const onClickRemoveImage = () => {
    if (window.confirm('Подтверждаете удаление изображения?')) {
      setImageUrl('');
    }
  };

  const onChange = React.useCallback((value: string) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setDisabled(true);
      setIsLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании статьи');
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setText(data.text);
          setTitle(data.title);
          setTags(data.tags.join(',')); //преобразуем в строчку
          setImageUrl(data.imageUrl);
        })
        .catch((err) => {
          console.warn(err);
          alert('Ошибка при получении данных поста');
        });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current?.click() /*вызов input*/}
        variant="outlined"
        size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={backendUrl + imageUrl} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        // @ts-ignore: Не удалось типизировать options
        options={options}
      />
      <div className={styles.buttons}>
        <Button disabled={disabled} onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
