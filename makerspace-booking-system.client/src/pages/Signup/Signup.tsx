/**
 * The signup page at /signup.
 *
 * The same card as the login page, but it creates a new account instead of
 * signing in to an existing one. Takes no props — it keeps the typed email and
 * password in its own state and hands them to Supabase when the form is
 * submitted.
 */

import { useState } from 'react'
import './Signup.css'
// The card styling, shared with the login page.
import '../auth.css'
import { supabase } from '../../lib/supabaseClient'
import { useNavigate, Link } from "react-router-dom";



function Signup() {
    const navigate = useNavigate();


    /*
     * Three pieces of state. useState hands back the current value and a
     * function to change it; calling that function redraws the page.
     *
     * loading is true only while we are waiting for Supabase to answer, which
     * is what greys out the button so it cannot be pressed twice.
     */
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    //TODO: combine login and signup into a shared component
    //TODO: have it return to user page on success
    const handleSignup = async (event: any) => {
        event.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
            alert(error.message)
        } else {
            alert('Signup successful')
            navigate("/")
        }


        setLoading(false)
    }

    return (
        <div className="row flex flex-center">
            <div className="col-6 form-widget">
                <h1 className="header">Sign Up</h1>
                <p className="description">Create an account with email and password</p>
                <form className="form-widget" onSubmit={handleSignup}>
                    <div>
                        <input
                            className="auth-input"
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            required={true}
                            /* Runs on every keystroke and stores what was typed. */
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="password">Password</label>
                        <input
                            className="auth-input"
                            id="password"
                            type="text"
                            placeholder="Your password"
                            value={password}
                            required={true}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button className="auth-btn" disabled={loading}>
                        {loading ? <span>Loading</span> : <span>Sign Up</span>}
                    </button>
                </form>

                {/*
                  * Link is React Router's version of an <a> tag. It swaps the page
                  * over without the browser reloading the whole app.
                  */}
                <p className="auth-foot">
                    Already have an account? <Link to="/login">Login</Link>
                </p>

            </div>
        </div>
    )

}

export default Signup;
