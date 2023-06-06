'use client';
import styles from './page.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function Home() {
  const route = useRouter();
  return route.push('/login')

}
