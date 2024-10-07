'use client';
import {  signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import React, { useEffect, useState} from "react";
import { auth } from "src/app/config/firebaseInit";
import { useRouter } from "next/navigation";
import NavHeader from "src/app/components/navHeader";
import { IoMdArrowRoundBack } from "react-icons/io";


const Login = () => { 

    useEffect(() => {
        document.title = 'CIREGS - Login';
    }   ,[]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(false); // Hide password input and show forgot password button when user clicks on forgot password
    const [loginMsg, setLoginMsg] = useState('');
    const router = useRouter();

    function handleReturnToLogin() {
        setHidePassword(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential);
            const user = userCredential.user;
            localStorage.setItem('token', user.accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            router.push("/adminDash")
        } catch (error) {
            setLoginMsg("Invalid email or password. Please try again."); // Show login error messages instead of printing to console
        }
     }

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setLoginMsg("If the entered email is registered, you will receive a password reset link shortly.");
        } catch (error) {
            setLoginMsg("If the entered email is registered, you will receive a password reset link shortly.");
        }
    }
    

    return (
        <>
        <NavHeader />
        <div id='content' className="flex overflow-hidden h-screen items-center justify-center bg-center bg-cover bg-login-img">
            <div className="flex flex-col items-center justify-center">
                <form onSubmit={handleSubmit} className="rounded px-8 pt-6 pb-8 mb-4 w-[40vw]">
                    <div className="flex items-center pb-2" >
                        <IoMdArrowRoundBack className="cursor-pointer mr-2 mb-1" size={20} style={{display: hidePassword ? 'flex' : 'none'}} onClick={handleReturnToLogin} color="white"/>
                        <h1 className="text-2xl font-bold mb-1 text-white">Login</h1>
                    </div>

                    <input 
                    type="email"
                    className="block w-full mb-4 px-4 py-2 border rounded shadow text-black"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    />


                    <input style={{display: hidePassword ? 'none' : 'block'}}
                    type="password"
                    className="block w-full mb-4 px-4 py-2 border rounded shadow text-black"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    />

                    <a onClick={() => setHidePassword(true)} style={{display: hidePassword ? 'none' : 'block'}} className="text-white hover:text-blue-700 pb-5 pt-0 cursor-pointer">Forgot Password?</a>

                    <button type="submit" className="bg-rose-600 hover:bg-rose-800 text-white font-bold py-2 px-4 rounded text-center w-full" style={{display: hidePassword ? 'none' : 'block'}}>Login</button>
                    <button onClick={handleForgotPassword} className="bg-rose-600 hover:bg-rose-800 text-white font-bold py-2 px-4 rounded text-center w-full" style={{display: hidePassword ? 'block' : 'none'}}>Send Password Reset Link</button>
                    <p className="text-warning">{loginMsg}</p>
                </form>
            </div>
        </div>
        </>

    )
}

export default Login