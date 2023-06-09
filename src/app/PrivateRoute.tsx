// 'use client'
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import { useAuth } from './Auth';
// import PageAuth from './PageAuth';

// export function PrivateRoute({ children }) {
//   const { userData } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!userData) {
//       router.push('/login');
//     }
//   }, [userData, router]);

//   if (!userData) {
//     // loading spinner 
//     return (<PageAuth />)
//   }

//   return children;
// }
