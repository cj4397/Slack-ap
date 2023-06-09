<<<<<<< HEAD
'use client';

import Link from "next/link"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { Stack } from "@mui/material";
import { useAuth } from "../auth";
=======
'use client'
import React from 'react';
import { Grid, Stack } from '@mui/material';
import { useAuth } from '../Auth';
>>>>>>> 0ef000a0c6c904cfd340f3ee14826c25af953aca
import { useRouter } from 'next/navigation';
// import { PrivateRoute } from '@/app/PrivateRoute';

<<<<<<< HEAD
export default function Dashboardlayout(
    props: {
        children: React.ReactNode
    }
) {
    const { user } = useAuth()
    const route = useRouter();
    if (user === null) {
        return route.push('/')
    }
    return (
        <>
            <section>
                <Grid2 container spacing={2}>
                    <Grid2 xs={3}>
=======
export default function DashboardLayout(props: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const router = useRouter();
>>>>>>> 0ef000a0c6c904cfd340f3ee14826c25af953aca

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
