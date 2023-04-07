import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

// enum - можно использовать в TypeScript. Объект нельзяы
export enum Status {
  LOADING = 'loading',
  SUCCESS = 'loaded',
  ERROR = 'error',
  NOT_FOUND = 'not_found',
}

//interface присваевается без "=" для initialState
interface IPostSliceState {
  typePosts: string;
  posts: {
    items: TItemsPost[];
    status: Status;
  };
  tags: {
    items: string[];
    status: Status;
  };
  comments: {
    items: TItemscomment[];
    status: Status;
  };
}

export type TItemsPost = {
  _id: number;
  commentsCount: number;
  createdAt: Date;
  imageUrl: string;
  tags: string[];
  text: string;
  title: string;
  updatedAt: Date;
  user: TUser;
  viewsCount: number;
};

type TUser = {
  _id: number;
  avatarUrl: string;
  fullName: string;
};

export type TItemscomment = {
  _id: number;
  createdAt: Date;
  post: TItemsPost['_id'];
  text: string;
  updatedAt: Date;
  user: TUser;
};

//Получает все посты с учетом сортировки (новые, популярные)
export const fetchPosts = createAsyncThunk<TItemsPost[], String, { rejectValue: string }>(
  'posts/fetchPosts',
  async (sort, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<TItemsPost[]>(`/posts/${sort}`);
      return data;
    } catch (error: any) {
      console.warn('Ошибка получения новых постов, либо популярных');
      return rejectWithValue(error);
    }
  },
);

//Получает массив постов содержащих указанный тег
export const fetchPostsTag = createAsyncThunk<TItemsPost[], String, { rejectValue: string }>(
  'posts/',
  async (tag, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<TItemsPost[]>(`/tags/${tag}`);
      return data;
    } catch (error: any) {
      console.warn('Ошибка получения новых постов содеражащих тег');
      return rejectWithValue(error);
    }
  },
);

//Получает массив тегов всех
export const fetchTags = createAsyncThunk<TItemsPost['tags'], undefined, { rejectValue: string }>(
  'posts/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<TItemsPost['tags']>(`/tags`);
      return data;
    } catch (error: any) {
      console.warn('Ошибка получения всех тегов');
      return rejectWithValue(error);
    }
  },
);

//Удаляет пост по id
export const fetchRemovePost = createAsyncThunk<
  Boolean,
  TItemsPost['_id'],
  { rejectValue: string }
>('posts/fetchRemovePost', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`/posts/${id}`);
    return data.success as Boolean;
  } catch (error: any) {
    console.warn('Ошибка удаления поста по id');
    return rejectWithValue(error);
  }
});

//Возвращает массив либо всех комментариев, либо комментариев к посту
export const fetchComments = createAsyncThunk<
  TItemscomment[],
  TItemsPost['_id'],
  { rejectValue: string }
>('posts/fetchComments', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<TItemscomment[]>(`/comments/${id}`);
    return data;
  } catch (error: any) {
    console.warn('Ошибка получения всех комментариев, либо комментариев к посту по id');
    return rejectWithValue(error);
  }
});

//Возвращает нужное количество комментариев
export const fetchCommentsQuantity = createAsyncThunk<
  TItemscomment[],
  Number,
  { rejectValue: string }
>('posts/fetchCommentsQuantity', async (quantity, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<TItemscomment[]>(`/comments/quantity/${quantity}`);
    return data;
  } catch (error: any) {
    console.warn('Ошибка получения указанного количества комментариев');
    return rejectWithValue(error);
  }
});

const initialState: IPostSliceState = {
  typePosts: '',
  posts: {
    items: [],
    status: Status.LOADING,
  },
  tags: {
    items: [],
    status: Status.LOADING,
  },
  comments: {
    items: [],
    status: Status.LOADING,
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setTypePosts: (state, action) => {
      state.typePosts = action.payload;
    },
  },
  extraReducers: (builder) => {
    //Получение статей по дате
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.posts.items = [];
        state.posts.status = Status.LOADING;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = Status.SUCCESS;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.posts.items = [];
        state.posts.status = Status.ERROR;
      });

    //Получение статей популярных и по тегам
    builder
      .addCase(fetchPostsTag.pending, (state) => {
        state.posts.items = [];
        state.posts.status = Status.LOADING;
      })
      .addCase(fetchPostsTag.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = Status.SUCCESS;
      })
      .addCase(fetchPostsTag.rejected, (state) => {
        state.posts.items = [];
        state.posts.status = Status.ERROR;
      });

    //Получение тегов
    builder
      .addCase(fetchTags.pending, (state) => {
        state.tags.items = [];
        state.tags.status = Status.LOADING;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags.items = action.payload;
        state.tags.status = Status.SUCCESS;
      })
      .addCase(fetchTags.rejected, (state) => {
        state.tags.items = [];
        state.tags.status = Status.ERROR;
      });

    //Получение комментариев всех
    builder
      .addCase(fetchComments.pending, (state) => {
        state.comments.items = [];
        state.comments.status = Status.LOADING;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments.items = action.payload;
        state.comments.status = Status.SUCCESS;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.comments.items = [];
        state.comments.status = Status.ERROR;
      });

    //Получение комментариев указанное кол-во
    builder
      .addCase(fetchCommentsQuantity.pending, (state) => {
        state.comments.items = [];
        state.comments.status = Status.LOADING;
      })
      .addCase(fetchCommentsQuantity.fulfilled, (state, action) => {
        state.comments.items = action.payload;
        state.comments.status = Status.SUCCESS;
      })
      .addCase(fetchCommentsQuantity.rejected, (state) => {
        state.comments.items = [];
        state.comments.status = Status.ERROR;
      });

    //Удаление статьи
    builder.addCase(fetchRemovePost.fulfilled, (state, action) => {
      state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg);
    });
  },
});

// // Попытка сделать общий getExtraReducer
// function getExtraReducer<T>(
//   builder: ActionReducerMapBuilder<IPostSliceState>,
//   asyncThunk: T,
//   nameState: any,
// ) {
//   builder.addCase(asyncThunk.pending, (state) => {
//     state.posts.items = [];
//     state.posts.status = Status.LOADING;
//   });

//   builder.addCase(asyncThunk.fulfilled, (state, action) => {
//     state.posts.items = action.payload;
//     state.posts.status = Status.SUCCESS;
//   });

//   builder.addCase(asyncThunk.rejected, (state) => {
//     state.posts.items = [];
//     state.posts.status = Status.ERROR;
//   });
// }

export const { setTypePosts } = postsSlice.actions;

export const postsReducer = postsSlice.reducer;
