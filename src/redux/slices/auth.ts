import {
  createSlice,
  createAsyncThunk,
  ActionReducerMapBuilder,
  AsyncThunk,
} from '@reduxjs/toolkit';
import axios from '../../axios';
import { RootState } from '../store';

//Типизация initialState
interface IAuthSliceState {
  data: TAuth | null;
  status: Status; //loading | loaded | error
}

//Типизация объекта запроса пользователя
type TAuth = {
  _id: Number;
  fullName: String;
  email: String;
  avatarUrl: String;
  token?: String;
};

type TRegister = {
  email: String;
  password: String;
  fullName: String;
};

// enum - можно использовать в TypeScript. Объект нельзяы
export enum Status {
  LOADING = 'loading',
  SUCCESS = 'loaded',
  ERROR = 'error',
  NOT_FOUND = 'not_found',
}

export const fetchAuth = createAsyncThunk<TAuth>('auth/fetchAuth', async (params) => {
  const { data } = await axios.post('/auth/login', params);
  return data;
});

export const fetchRegister = createAsyncThunk<TAuth, TRegister>(
  'auth/fetchRegister',
  async (params) => {
    const { data } = await axios.post('/auth/register', params);
    return data;
  },
);

export const fetchAuthMe = createAsyncThunk<TAuth>('auth/fetchAuthMe', async () => {
  const { data } = await axios.get<TAuth>('/auth/me');
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
    authExtraReducer(builder, fetchAuth, 'Ошибка при попытки авторизации');
    authExtraReducer(builder, fetchAuthMe, 'Ошибка при проверке пользователя в БД');

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

function authExtraReducer(
  builder: ActionReducerMapBuilder<IAuthSliceState>,
  asyncThunk: AsyncThunk<TAuth, void, {}>,
  errorMessage: string,
): void {
  builder
    .addCase(asyncThunk.pending, (state) => {
      state.data = null;
      state.status = Status.LOADING;
    })
    .addCase(asyncThunk.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = Status.SUCCESS;
    })
    .addCase(asyncThunk.rejected, (state) => {
      console.log(state, errorMessage);
      state.data = null;
      state.status = Status.ERROR;
    });
}

export const selectIsAuth = (state: RootState) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
