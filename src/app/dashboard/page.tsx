'use client';
import Link from "next/link"
import { useAuth } from "../auth"
import { datas } from "../auth";

export default function Dashboard() {
    const { logout } = datas()
    return (
        <>
            <h1>Dashboard Page</h1>
            <Link href={'/'} onClick={() => logout()}>To main page</Link>
        </>
    )
}
