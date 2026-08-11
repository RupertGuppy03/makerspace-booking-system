import { useState } from 'react'
import { supabase } from "../../lib/supabaseClient"
import './Login.css'

interface AuthDetails {
    email: string,
    password: string
}

export default function Login() {

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
        }


        setLoading(false)
    }

    return (
        <div className="row flex flex-center">
            <div className="col-6 form-widget">
                <h1 className="header">Supabase + React</h1>
                <p className="description">Login with email and password</p>
                <form className="form-widget" onSubmit={handleLogin}>
                    <div>
                        <input
                            className="inputField"
                            type="email"
                            placeholder="Your email"
                            value={email}
                            required={true}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="inputField"
                            type="text"
                            placeholder="Your Password"
                            value={password}
                            required={true}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                    </div>
                    <div>
                        <button className={'button block'} disabled={loading}>
                            {loading ? <span>Loading</span> : <span>Login</span>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}