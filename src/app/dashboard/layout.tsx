'use client';

import Link from "next/link"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { Stack } from "@mui/material";

export default function Dashboardlayout(
    props: {
        children: React.ReactNode
    }
) {
    return (
        <>
            <section>
                <Grid2 container spacing={2}>
                    <Grid2 xs={3}>

                        <h1>Side Navaigation</h1>

                        <Stack id="sidenav">
                            <Link href={'/dashboard'}>Home</Link>
                            <Link href={'/dashboard/DM'}>Direct Message</Link>
                            <Link href={'/dashboard/GroupChat'}>GroupChat</Link>
                            <Link href={'/dashboard/profile'}>Profile</Link>
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