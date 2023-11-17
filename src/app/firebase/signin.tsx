
import firebase_app from "./config";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth";
import { getDatabase, set, ref } from 'firebase/database'

const auth = getAuth(firebase_app);

export function FirebaseApi() {
    const { login, signup } = useAuth()
    const route = useRouter();


    const signIn = async (email: string, password: string) => {

        const result: any = await signInWithEmailAndPassword(auth, email, password);
        if (!result.error) {
            // login(result)
            route.push('/dashboard');
            console.log('ok')
        } else {
            console.log("error")
        }
        console.log(result)
        console.log(result.user)
        // login(result.user, result._tokenResponse)
        // const pass = await result.json()
        // console.log(pass)





    }

    const signUp = async (email: string, password: string) => {
        const result: any = await createUserWithEmailAndPassword(auth, email, password);
        if (!result.error) {
            signup(result)
            route.push('/dashboard');
        }
        console.log(result)
    }


    return {
        signIn,
        signUp
    }





}