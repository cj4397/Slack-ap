"use client"
import Link from "next/link"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { Stack } from "@mui/material";
import { useAuth } from '../auth';
import { useRouter } from 'next/navigation';

export default function Dashboardlayout(
  props: {
    children: React.ReactNode
  }
) {
  const { user, logout } = useAuth()
  const route = useRouter();
  if (user === null) {
    return route.push('/login')
  }
  return (
    <>
      <section>
        <Grid2 container spacing={2}>
          <Grid2 xs={3}>

            <h1>Side Navaigation</h1>

            <Stack id="sidenav">

              <Link href={'/dashboard/DirectMessage'}>Direct Message</Link>
              <Link href={'/dashboard/Channels'}>GroupChat</Link>
              <Link href={'/'} onClick={() => logout()}>Log Out</Link>
            </Stack>
          </Grid2>
          <Grid2 xs={9}>
            {props.children}
          </Grid2>
        </Grid2>

      </section>


    </>
  )
}