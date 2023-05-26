'use client';
import Link from "next/link"
import { useState } from "react";
import './login.css'

export default function Login() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [slide, setSlide] = useState(false)

    // const { login, signup } = useAuth();

    const handleSubmit_sign_in = (e: any) => {
        e.preventDefault();
        // login({
        //     email: email,
        //     password: password
        // })
        async function apitry() {

            const response = await fetch('http://206.189.91.54/api/v1/auth/sign_in', {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify(
                    {
                        email: "user1@example.com",
                        password: "12345678",
                        password_confirmation: "12345678"
                    }
                )
            });
            const data = await response.json();
            console.log(data);
        }

        apitry();
        async function api() {

            const response = await fetch('http://206.189.91.54/api/v1/auth/');
            const data = await response.json();
            console.log(data);
        }
        api()

    }

    const handleSubmit_sign_up = (e: any) => {
        e.preventDefault();
        //     signup({
        //         name: name,
        //         email: email,
        //         password: password
        //     })




    }


    const slide_animation = () => {
        setSlide(slide ? false : true)
    }
    return (
        <>
            <h1>Login page</h1>

            <Link href={'/'}>Main page</Link>

            <main id="body">
                <div className={`container , ${slide ? 'right-panel-active' : ''}`} id="sidebar">
                    <div className="form-container sign-up-container">
                        <form onSubmit={handleSubmit_sign_up} autoComplete="on">
                            <h1>Create Account</h1>

                            <input id="new_name" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                            <input id="new_email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <input id="new_password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                            <button >Sign Up</button>
                        </form>
                    </div>
                    <div className="form-container sign-in-container">
                        <form onSubmit={handleSubmit_sign_in}>
                            <h1>Sign in</h1>


                            <input id="user_email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <input id="user_password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <a href="#">Forgot your password?</a>
                            <button >Sign In</button>
                        </form>
                    </div>
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1>Welcome Back!</h1>
                                <p>To keep connected with us please login with your personal info</p>
                                <button onClick={slide_animation} className="ghost" id="signIn">Sign In</button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1>Hello, Friend!</h1>
                                <p>Enter your personal details and start journey with us</p>
                                <button onClick={slide_animation} className="ghost" id="signUp">Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>


            </main>

        </>
    )
}
