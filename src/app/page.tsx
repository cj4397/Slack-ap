'use client'
import styles from './page.module.css'
import Link from 'next/link'
<<<<<<< HEAD
import { useRouter } from 'next/navigation';
import Login from './login/page';

export default function Home() {
  const route = useRouter();
  return <Login />
=======


export default function Home() {
  return (
    <>
      <h1> Main page</h1>
>>>>>>> 0ef000a0c6c904cfd340f3ee14826c25af953aca


      <nav>

        <Link href={'/login'}> login</Link>
      </nav>

    </>
  )
}
