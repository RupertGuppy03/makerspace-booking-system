import { useState } from 'react'
import './Signup.css'
import { supabase } from '../../lib/supabaseClient'

interface AuthDetails {
    email: string,
    password: string
}


function Signup() {



    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    //TODO: combine login and signup into a shared component
    //TODO: have it return to user page on success
    const handleSignup = async (event : any) => {
        event.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
            alert(error.message)
        } else {
            alert('Signup successful')
        }


        setLoading(false)
    }

    return (
        <div className="row flex flex-center">
            <div className="col-6 form-widget">
                <h1 className="header">Supabase + React</h1>
                <p className="description">Sign up with email and password</p>
                <form className="form-widget" onSubmit={handleSignup}>
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
                            {loading ? <span>Loading</span> : <span>Sign Up</span>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
   
}

export default Signup;