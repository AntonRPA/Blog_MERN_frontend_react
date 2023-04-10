import {
  createSlice,
  createAsyncThunk,
  // ActionReducerMapBuilder,
  // AsyncThunk,
} from '@reduxjs/toolkit';
import axios from '../../axios';
import { RootState } from '../store';

//Типизация initialState
interface IAuthSliceState {
  data: TAuthReturn | null;
  status: Status; //loading | loaded | error
}

//Типизация объекта получаемого о пользователе
export type TAuthReturn = {
  _id: string;
  fullName: string;
  email: TAuth['email'];
  avatarUrl: string; //Для запроса: /auth/me
  token: string; //Для запросов: /auth/login; /auth/register
};

//Типизация объекта отправляемого для авторизации
export type TAuth = {
  email: string;
  password: string;
};

//Типизация объекта отправляемого для регистрации
export type TRegister = TAuth & {
  fullName: string;
};

// enum - можно использовать в TypeScript. Объект нельзяы
export enum Status {
  LOADING = 'loading',
  SUCCESS = 'loaded',
  ERROR = 'error',
  NOT_FOUND = 'not_found',
}

export const fetchAuth = createAsyncThunk<TAuthReturn, TAuth>('auth/fetchAuth', async (params) => {
  const { data } = await axios.post('/auth/login', params);
  return data;
});

export const fetchRegister = createAsyncThunk<TAuthReturn, TRegister>(
  'auth/fetchRegister',
  async (params) => {
    const { data } = await axios.post('/auth/register', params);
    return data;
  },
);

export const fetchAuthMe = createAsyncThunk<TAuthReturn>('auth/fetchAuthMe', async () => {
  const { data } = await axios.get<TAuthReturn>('/auth/me');
  return data;
});

const initialState: IAuthSliceState = {
  data: null,
  status: Status.LOADING,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    //Авторизация
    builder
      .addCase(fetchAuth.pending, (state) => {
        state.data = null;
        state.status = Status.LOADING;
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = Status.SUCCESS;
      })
      .addCase(fetchAuth.rejected, (state) => {
        console.log(state, 'Ошибка при попытки авторизации');
        state.data = null;
        state.status = Status.ERROR;
      });

    //Проверка  пользователя по токену
    builder
      .addCase(fetchAuthMe.pending, (state) => {
        state.data = null;
        state.status = Status.LOADING;
      })
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = Status.SUCCESS;
      })
      .addCase(fetchAuthMe.rejected, (state) => {
        console.log(state, 'Ошибка при проверке пользователя в БД');
        state.data = null;
        state.status = Status.ERROR;
      });

    //Создание пользователя
    builder
      .addCase(fetchRegister.pending, (state) => {
        state.data = null;
        state.status = Status.LOADING;
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = Status.SUCCESS;
      })
      .addCase(fetchRegister.rejected, (state) => {
        console.log(state, 'Ошибка при создание пользователя');
        state.data = null;
        state.status = Status.ERROR;
      });
  },
});

// function authExtraReducer(
//   builder: ActionReducerMapBuilder<IAuthSliceState>,
//   asyncThunk: AsyncThunk<TAuthReturn, TAuth, {}>,
//   errorMessage: string,
// ): void {
//   builder
//     .addCase(asyncThunk.pending, (state) => {
//       state.data = null;
//       state.status = Status.LOADING;
//     })
//     .addCase(asyncThunk.fulfilled, (state, action) => {
//       state.data = action.payload;
//       state.status = Status.SUCCESS;
//     })
//     .addCase(asyncThunk.rejected, (state) => {
//       console.log(state, errorMessage);
//       state.data = null;
//       state.status = Status.ERROR;
//     });
// }

export const selectIsAuth = (state: RootState) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
