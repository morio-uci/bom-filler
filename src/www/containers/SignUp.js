import {Button, Form, Alert} from "react-bootstrap"
import React, {useState} from "react"

const SignUp = (props) => {
    const [name, setName] = useState("")
    const [username, setUsername]  = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState(null)
    async function handleSubmit(event) {
        event.preventDefault()
        setMessage({variant: "primary", message: "Signing up..."})
        const result = await window.fetch(`/api/v1/user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, name, email, password})
        })
        const resBody = await result.json()
        if (resBody.success) {
            props.onAuthChange(resBody)
        }
        else {
            if (resBody.hasOwnProperty('reason')) {
                if(resBody.reason === 'username is already taken') {
                    setUsername("")
                }
                setMessage({variant: "danger", message: `Failed to sign up, ${resBody.reason}`})
            }
            else {

                setMessage({variant: "danger", message: "Failed to sign up, try again"})
            }
            setPassword("")
            setConfirmPassword("")
        }
    }

    function validateForm() {
        return username.length >0
            && name.length > 0
            && email.length > 0
            && password.length > 0
            && password === confirmPassword
    }


    return (
        <div className="SignUp">
            {message === null ? ("") : <Alert variant={message.variant}>{message.message}</Alert>}
            <form onSubmit={handleSubmit}>
                <Form.Group controlId="signup-username" size="lg">
                    <Form.Control
                        autoFocus
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="signup-name" size="lg">
                    <Form.Control
                        placeholder="Your Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="signup-email" size="lg">
                    <Form.Control
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="signup-password" size="lg">
                    <Form.Control
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                </Form.Group>
                <Form.Group controlId="signup-confirm-password" size="lg">
                    <Form.Control
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        type="password"
                    />
                </Form.Group>
                <Button block size="lg" disabled={!validateForm()} type="submit">
                    Sign Up
                </Button>
            </form>
        </div>
    )
}

export default SignUp