'use client'



import { useState } from "react";

import './login.css'
import { FirebaseApi } from "../firebase/signin";




export default function Login() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signin, signup } = FirebaseApi()



    const [slide, setSlide] = useState(false);

    const handleSubmitSignIn = async (e: any) => {
        e.preventDefault();
        signin(email, password)

    }

    const handleSubmitSignUp = async (e: any) => {
        e.preventDefault();

        signup(name, email, password)

    }

    const slideAnimation = () => {
        setSlide(!slide);
    }


    return (

        <>

            <main id="body">
                <div className={`container ${slide ? 'right-panel-active' : ''}`} id="sidebar">
                    <div className="form-container sign-up-container">

                        <form onSubmit={handleSubmitSignUp} autoComplete="on">
                            <h1>Create Account</h1>


                            <input id="new_name" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                            <input id="new_email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <input id="new_password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <button className='login'>Sign Up</button>
                        </form>
                    </div>
                    <div className="form-container sign-in-container">

                        <form onSubmit={handleSubmitSignIn}>
                            <h1>Sign in</h1>


                            <input id="user_email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <input id="user_password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <a href="#">Forgot your password?</a>
                            <button className='login'>Sign In</button>
                        </form>
                    </div>
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1>Welcome Back!</h1>
                                <p>To keep connected with us please login with your personal info</p>
                                <button onClick={slideAnimation} className="ghost login" id="signIn">Sign In</button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1>Hello, Friend!</h1>
                                <p>Enter your personal details and start the journey with us</p>
                                <button onClick={slideAnimation} className="ghost login" id="signUp">Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>

    );
}
