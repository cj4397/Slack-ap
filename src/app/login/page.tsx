'use client';

import { useRouter } from 'next/navigation';



import { useState, useEffect } from "react";

import { useAuth } from "../auth";
import './login.css'





export default function Login() {



    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const route = useRouter();


    const { login } = useAuth()

    // const { login } = Datas()

    const [slide, setSlide] = useState(false)




    const handleSubmit_sign_in = async (e: any) => {
        e.preventDefault();

        const response = await fetch('http://206.189.91.54/api/v1/auth/sign_in', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {

                    email: email,
                    password: password,
                    password_confirmation: password
                }
            )
        });

        const data = await response.json()



        if (response.ok) {
            login({
                user_info: data,
                user_data: {
                    accessToken: response.headers.get('Access-Token'),
                    password: password,
                    email: email,
                    client: response.headers.get('Client'),
                    expiry: response.headers.get('Expiry'),
                    uid: response.headers.get('Uid')
                }
            }
            )

            dotenv.populate(process.env, { ACCESS_TOKEN: response.headers.get('Access-Token') })

            dotenv.populate(process.env, { CLIENT: response.headers.get('Client') })


            dotenv.populate(process.env, { EXPIRY: response.headers.get('Expiry') })


            dotenv.populate(process.env, { UID: response.headers.get('Uid') })


            route.push('/dashboard')

        }


    }

    const handleSubmit_sign_up = (e: any) => {
        e.preventDefault();


        async function apitry() {

            const response = await fetch('http://206.189.91.54/api/v1/auth/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        name: name,
                        email: email,
                        password: password,
                        password_confirmation: password
                    }
                )
            });
            const data = await response.json();
            console.log(data);
        }
        apitry()
    }



    const slide_animation = () => {
        setSlide(slide ? false : true)
    }
    return (
        <>



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

                            <button >Sign In</button>
                        </form>
                    </div>
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1>Welcome Back!</h1>
                                <p>To keep connected with us please login with your personal info</p>
                                <button onClick={slide_animation} className="ghost"
                                    id="signIn">Sign In</button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1>Hello, Friend!</h1>
                                <p>Enter your personal details and start journey with us</p>
                                <button
                                    onClick={slide_animation}

                                    className="ghost" id="signUp">Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>


            </main>

        </>
    )
}
