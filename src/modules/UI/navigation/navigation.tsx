'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { AppDispatch } from '@/store/store';
import { logOut } from '@/store/reducers/auth-slice';
import { useRouter } from 'next/navigation';
import { openModal } from '@/store/reducers/modal-slice';
// import { ModalWrapper } from '@/modules/common/modal/modalWrapper';

const pages = ['Notes', 'Sign Up'];
const settings = ['Profile', 'Logout'];

function Navigation() {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch<AppDispatch>();
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page: string) => {
    setAnchorElNav(null);
    if (page === 'Sign Up') {
      // Test modal
      dispatch(openModal({ name: 'signUpModal' }));
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSetting = (setting: string) => {
    if (setting === 'Logout') {
      dispatch(logOut());
      router.push(`${window.location.origin}/auth/login`);
    }
  };

  return (
    <AppBar
      sx={{
        color: 'black',
        background:
          'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(1,149,231,1) 100%)',
      }}
      position='absolute'
    >
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Box
            sx={{
              width: 120,
              height: 30,
              display: { xs: 'none', md: 'flex' },
              mr: 1,
              borderRadius: '10%',
            }}
          >
            <Image
              src='/logo/ai_logo_planner.png'
              alt='logo'
              className='flex h-full'
              width={120}
              height={30}
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map(page => (
                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                  <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Image
              src='/logo/ai_logo_planner.png'
              alt='logo'
              className='flex w-20 h-10'
              width={80}
              height={40}
            />
          </Box>
          <Box
            className='flex gap-2'
            sx={{
              flexGrow: 1,
              gap: '0.5rem',
              display: { xs: 'none', lg: 'block', xl: 'none' },
            }}
          >
            {pages.map(page => (
              <Button
                key={page}
                variant='outlined'
                onClick={() => handleCloseNavMenu(page)}
                sx={{
                  my: 2,
                  color: 'black',
                  display: { xs: 'none', md: 'flex', lg: 'block', xl: 'none' },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {user && (
            <Box sx={{ flexGrow: 0, alignContent: 'right', mr: '10px' }}>
              {' '}
              Welcome back, {user?.userName?.toUpperCase()}
            </Box>
          )}

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='Open settings'>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt='Remy Sharp' src='/static/images/avatar/2.jpg' />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {user && (
                <Box
                  sx={{
                    display: 'flex',
                  }}
                >
                  <Typography
                    sx={{ textAlign: 'center', p: '10px', color: 'darkblue' }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              )}
              {settings.map(setting => (
                <MenuItem
                  sx={{ m: '10px' }}
                  key={setting}
                  disabled={setting === 'Profile'}
                  onClick={handleCloseUserMenu}
                >
                  <Box onClick={() => handleSetting(setting)}>
                    <Typography sx={{ textAlign: 'center' }}>
                      {setting}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navigation;
