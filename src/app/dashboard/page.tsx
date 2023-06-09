'use client';
import Link from "next/link"
import { useAuth } from "../auth";


export default function Dashboard() {
    const { logout } = useAuth()
    console.log(process.env.ACCESS_TOKEN)
    return (
        <>
            <h1>Dashboard Page</h1>
            <Link href={'/'} onClick={() => logout()}>To main page</Link>
        </>
    )
}


