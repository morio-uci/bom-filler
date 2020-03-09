import {Button, Form, Alert} from "react-bootstrap"
import React, {useState} from "react"

const Login = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState(null)

     const handleSubmit = async event => {
        event.preventDefault()
        setMessage({variant: "primary", message: "Logging in..."})
        const result = await window.fetch(`/api/v1/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password})
        })
        const resBody = await result.json()
        if (resBody.success) {
            props.onAuthChange(resBody)
        }
        else {
            setPassword("")
            setMessage({variant: "danger", message: "Failed to login, try again"})
        }
    }

    function validateForm() {
        return username.length > 0 && password.length > 0
    }


    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                {message === null ? ("") : <Alert variant={message.variant}>{message.message}</Alert>}
                <Form.Group controlId="login-username" size="lg">
                    <Form.Control
                        autoFocus
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="password" size="lg">
                    <Form.Control
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                </Form.Group>
                <Button block size="lg" disabled={!validateForm()} type="submit">
                    Login
                </Button>
            </form>
        </div>
    )
}

export default Login