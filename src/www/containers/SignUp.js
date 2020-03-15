import {Button, Form, Alert} from "react-bootstrap"
import React, {useState} from "react"
import { gql } from 'apollo-boost';
import { useMutation} from 'react-apollo';

const SignUp = (props) => {
    const SIGN_UP = gql`
        mutation SignUp($signUp: SignUpInput!) {
            userSignUp(signUp: $signUp) {
                success
                reason
                user {
                    id
                    username
                    name
                    email
                }
            }
        }
    `

    const [name, setName] = useState("")
    const [username, setUsername]  = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState(null)

    const [signUp, {loading: signingUp, error: signUpError}] = useMutation(SIGN_UP,
        {onCompleted: ({userSignUp}) => {
            if (userSignUp.success) {
                setMessage(null)
                props.onAuthChange(userSignUp)
            }
            else {
                if (userSignUp.hasOwnProperty('reason')) {
                    setMessage({variant: 'danger', message: userSignUp.reason})
                } else {
                    setMessage({variant: "danger", message: "Failed to sign up, try again"})
                }
            }
        }
    })
    async function handleSubmit(event) {
        event.preventDefault()

        await signUp({variables: {
            signUp: {credentials: {username, password}, name, ...(email !== '' && {email})}
        }})
        setPassword("")
        setConfirmPassword("")
    }

    function validateForm() {
        return username.length >0
            && name.length > 0
            && password.length > 0
            && password === confirmPassword
    }


    return (
        <div className="SignUp">
            {signingUp && <Alert variant="info">Signing up...</Alert>}
            {signUpError && <Alert variant="error">Attempting to sing up, try again</Alert>}
            {message !== null && <Alert variant={message.variant}>{message.message}</Alert>}
            <form onSubmit={handleSubmit}>
                <Form.Group controlId="signup-username" size="lg">
                    <Form.Control
                        autoFocus
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value.trim())}
                    />
                </Form.Group>
                <Form.Group controlId="signup-name" size="lg">
                    <Form.Control
                        placeholder="Your Name"
                        value={name}
                        onChange={e => setName(e.target.value.trim())}
                    />
                </Form.Group>
                <Form.Group controlId="signup-email" size="lg">
                    <Form.Control
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value.trim())}
                    />
                </Form.Group>
                <Form.Group controlId="signup-password" size="lg">
                    <Form.Control
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value.trim())}
                        type="password"
                    />
                </Form.Group>
                <Form.Group controlId="signup-confirm-password" size="lg">
                    <Form.Control
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value.trim())}
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