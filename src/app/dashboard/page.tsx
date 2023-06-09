'use client'
import Link from "next/link"
import { useAuth } from "../Auth";


export default function Dashboard() {
  const { logout } = useAuth()






  return (
    <>
      <h1>Dashboard Page</h1>
      <Link href={'/'} onClick={() => logout()}>To main page</Link>



    </>
  )
}
