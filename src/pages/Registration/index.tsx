import React from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { TAuthReturn, TRegister, fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import { useAppDispatch, useAppSelector } from '../../redux/store';

const Registration: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: 'Вася Романов',
      email: 'vasya@test.ru',
      password: '12345',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (values: TRegister) => {
    //Запрос на бэкенд для создания нового пользователя
    const data = await dispatch(fetchRegister(values));

    //Проверка что данные от бэкенда получены
    if (!data.payload) {
      return alert('Не удалось создать нового пользователя!');
    }

    //Сохранение токена в localStorage
    // @ts-ignore: баг TS https://github.com/microsoft/TypeScript/issues/51501
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token as TAuthReturn['token']);
    }
  };

  console.log(errors, isValid);
  console.log('isAuth', isAuth);

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper elevation={0} classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          type="fullName"
          {...register('fullName', { required: 'Укажите Имя и Фамилию' })}
          className={styles.field}
          label="Полное имя"
          fullWidth
        />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', { required: 'Укажите электронную почту' })}
          className={styles.field}
          label="E-Mail"
          fullWidth
        />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password"
          {...register('password', { required: 'Укажите пароль' })}
          className={styles.field}
          label="Пароль"
          fullWidth
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};

export default Registration;
