import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  // @ts-ignore: не удалось типизировать
  shadows: ['none'],
  palette: {
    primary: {
      main: '#4361ee',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
      fontWeight: 400,
    },
  },
});
