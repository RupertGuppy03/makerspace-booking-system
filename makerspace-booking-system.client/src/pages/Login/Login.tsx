/**
 * The login page at /login.
 *
 * Renders a single card holding an email field, a password field and a submit
 * button. Takes no props — it keeps the typed email and password in its own
 * state and hands them to Supabase when the form is submitted.
 */

import { useState } from 'react'
import { supabase } from "../../lib/supabaseClient"
import { useNavigate, Link } from "react-router-dom";

import './Login.css'
// The card styling, shared with the signup page.
import '../auth.css'

export default function Login() {
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
    const handleLogin = async (event : any) => {
        event.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            alert(error.message)

        } else {
            alert('Login successful')
            navigate("/")
        }


        setLoading(false)
    }

    return (
        // The dark full-height page. The card is centred inside it.
        <div className="auth-shell">
            <div className="auth-card">

                {/* The same blue mark the dashboard sidebar uses. */}
                <div className="auth-brand">
                    <span className="auth-mark">M</span>
                    <span className="auth-brand-name">Makerspace</span>
                </div>

                <h1 className="auth-title">Login</h1>
                <p className="auth-sub">Login with email and password</p>

                <form onSubmit={handleLogin}>
                    <div className="auth-field">
                        {/*
                          * htmlFor matches the input's id, which is what lets you
                          * click the word "Email" to jump into the field, and what
                          * screen readers use to read the two out together.
                          */}
                        <label className="auth-label" htmlFor="email">Email</label>
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
                        {loading ? <span>Loading</span> : <span>Login</span>}
                    </button>
                </form>

                {/*
                  * Link is React Router's version of an <a> tag. It swaps the page
                  * over without the browser reloading the whole app.
                  */}
                <p className="auth-foot">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>

            </div>
        </div>
    )
}
