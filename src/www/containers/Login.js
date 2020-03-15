import {Button, Form, Alert} from "react-bootstrap"
import React, {useState} from "react"
import { useMutation } from 'react-apollo'
import { gql } from 'apollo-boost';

const Login = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const LOGIN_QUERY = gql`
        mutation Login($credentials: CredentialsInput!) {
            userLogin(credentials: $credentials ) {
                success
                user {
                    id
                    username
                    name
                    email
                }
            }
        }
    `
     const [login, {loading: loggingIn, error: loginError}] = useMutation(LOGIN_QUERY, { onCompleted: ({userLogin}) => {

         if (userLogin.success)
         {
             props.onAuthChange(userLogin)
         }
     }});

     const handleSubmit = async event => {
         event.preventDefault()
         await login({variables: {credentials: {username, password}}})
         setPassword("")
    }

    function validateForm() {
        return username.length > 0 && password.length > 0
    }


    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                {loggingIn && <Alert variant="primary">Logging in...</Alert>}
                {loginError && <Alert variant="danger">Failed to login, try again"</Alert>}
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