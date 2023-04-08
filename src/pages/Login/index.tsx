import React from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './Login.module.scss';
import { TAuth, TAuthReturn, fetchAuth, selectIsAuth } from '../../redux/slices/auth';
import { useAppDispatch, useAppSelector } from '../../redux/store';

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: 'test3@test.ru',
      password: '12345',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (values: TAuth) => {
    //Запрос на бэкенд для получения данных пользователя
    const data = await dispatch(fetchAuth(values));

    //Проверка что данные от бэкенда получены
    if (!data.payload) {
      return alert('Не удалось авторизоваться!');
    }

    //Сохранение токена в localStorage
    // @ts-ignore: баг TS https://github.com/microsoft/TypeScript/issues/51501
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data?.payload.token as TAuthReturn['token']);
    }
  };

  console.log(errors, isValid);
  console.log('isAuth', isAuth);

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Укажите почту' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Укажите пароль' })}
          fullWidth
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
