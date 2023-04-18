import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Box, Menu, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { AccountCircle } from '@mui/icons-material';
import { loadUserInfo, userSelector } from '../state/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useMsal } from '@azure/msal-react';
import logoImage from '../images/logo-black.svg';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, { shouldForwardProp: prop => prop !== 'open' })<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

type TitleBarProps = {
  toggleDrawer: () => void;
  open: boolean;
};

export const TitleBar = ({ toggleDrawer, open }: TitleBarProps) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(userSelector);
  const { instance, accounts } = useMsal();

  const logout = () => {
    instance.logoutRedirect({
      account: accounts[0],
      postLogoutRedirectUri: 'https://techpros.no'
    });
  };

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  useEffect(() => {
    dispatch(loadUserInfo());
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setMenuOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  return (
    <AppBar position='absolute' elevation={1} color={'default'}>
      <Toolbar sx={{ pr: '24px', backgroundColor: '#ffffff' }}>
        <IconButton edge='start' color='inherit' aria-label='open drawer' onClick={toggleDrawer} sx={{ marginRight: '36px' }}>
          <MenuIcon />
        </IconButton>
        <Box mt={1}>
          <img src={logoImage} alt='Logo' loading='lazy' />
        </Box>

        <Typography component='h5' variant='body1' color='inherit' noWrap sx={{ flexGrow: 1 }} textAlign='right'>
          {userInfo != null ? userInfo.accountName : null}
        </Typography>
        <IconButton color='inherit' onClick={handleClick}>
          <AccountCircle />
        </IconButton>

        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
        >
          <MenuItem onClick={logout}>Sign out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
