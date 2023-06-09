'use client'
import styles from './page.module.css'
import Link from 'next/link'


export default function Home() {
  return (
    <>
      <h1> Main page</h1>


      <nav>

        <Link href={'/login'}> login</Link>
      </nav>

    </>
  )
}
