'use client'
import React from 'react';
import { Grid, Stack } from '@mui/material';
import { useAuth } from '../Auth';
import { useRouter } from 'next/navigation';
// import { PrivateRoute } from '@/app/PrivateRoute';

export default function DashboardLayout(props: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    // <PrivateRoute>
    <section>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Stack direction="column" spacing={2}>
            <button onClick={handleLogout}>Logout</button>
            <div>
              <h2>Channels</h2>
              <button>Add Channel</button>
            </div>
            <div>
              <h1>Direct Messages</h1>
            </div>
          </Stack>
        </Grid>
        <Grid item xs={12} md={9}>
          {props.children}
        </Grid>
      </Grid>
    </section>
    // </PrivateRoute>
  );
}
