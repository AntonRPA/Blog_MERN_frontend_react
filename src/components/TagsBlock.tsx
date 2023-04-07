import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TagIcon from '@mui/icons-material/Tag';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';

import { SideBlock } from './SideBlock';
import { setTypePosts } from '../redux/slices/posts';

type TTagsBlockProps = {
  items: String[];
  isLoading: Boolean;
};

export const TagsBlock: React.FC<TTagsBlockProps> = ({ items, isLoading = true }) => {
  const dispatch = useDispatch();
  return (
    <SideBlock title="Тэги">
      <List>
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          <Link
            key={i}
            onClick={() => dispatch(setTypePosts(name))}
            style={{ textDecoration: 'none', color: 'black' }}
            to={`/tags/${name}`}>
            <ListItem key={i} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? <Skeleton width={100} /> : <ListItemText primary={name} />}
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </SideBlock>
  );
};
