'use client';
import Link from "next/link"
import { Datas } from "../auth";


export default function Dashboard() {
    const { logout } = Datas()






    return (
        <>
            <h1>Dashboard Page</h1>
            <Link href={'/'} onClick={() => logout()}>To main page</Link>



        </>
    )
}


