import React from 'react';

import { SideBlock } from './SideBlock';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';
import { TItemscomment } from '../redux/slices/posts';
// import { useWhyDidYouUpdate } from 'ahooks';

type TCommentsBlockProps = {
  items: TItemscomment[];
  children?: any;
  isLoading: boolean;
};

export const CommentsBlock: React.FunctionComponent<TCommentsBlockProps> = React.memo(
  ({ items, children, isLoading }) => {
    console.log('render CommentsBlock');

    return (
      <SideBlock title="Комментарии">
        <List>
          {(isLoading ? [...Array(5)] : items).map((obj, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  {isLoading ? (
                    <Skeleton variant="circular" width={40} height={40} />
                  ) : (
                    <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
                  )}
                </ListItemAvatar>
                {isLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Skeleton variant="text" height={25} width={120} />
                    <Skeleton variant="text" height={18} width={230} />
                  </div>
                ) : (
                  <>
                    {/* {console.log(obj)} */}
                    <ListItemText primary={obj.user.fullName} secondary={obj.text} />
                  </>
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
        {children}
      </SideBlock>
    );
  },
);
