import React, { useState,  Suspense } from 'react'
import {Navbar, Nav, Form, Button, Alert} from 'react-bootstrap'
import { gql } from 'apollo-boost';
import { useQuery, useMutation} from 'react-apollo';

import './App.css'

const AuthenticatedApp = React.lazy(() => import('./containers/Authenticated'))
const UnauthenticatedApp = React.lazy(() => import('./containers/Unauthenticated'))

const App = props => {
    const AUTH = gql`
        query {
            userAuth {
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
    const LOGOUT = gql`
        mutation Logout {
            userLogout
        }
    `
    const [userAuth, setUserAuth] = useState({success: false})
    const {loading, error} = useQuery(AUTH, {onCompleted: ({userAuth}) => {
        setUserAuth(userAuth)
    }})

    const [logout, {loading: loggingOut, error: logoutError }] = useMutation(LOGOUT, {onCompleted: () =>{
            setUserAuth({success:false})
    }})

    const onAuthChange = (userAuth)=> {
        setUserAuth(userAuth)
    }

    return (

        <div className="App">
            <header>
                <Navbar>
                    <Navbar.Brand href="#home">Bom Filler</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        {userAuth && userAuth.success ? <Nav >
                            <Navbar.Text>
                                Signed in as: {userAuth.user.name}
                            </Navbar.Text>
                            <Form className="ml-1" inline>
                                <Button variant="outline-primary" onClick={logout}>Logout</Button>
                            </Form>
                        </Nav> : ("")
                        }
                    </Navbar.Collapse>
                </Navbar>
            </header>
            <main>
                { loggingOut && <Alert variant="info">Logging out...</Alert>}
                { logoutError && <Alert variant="danger">Error occurred logging out, try again</Alert>}
                {
                    loading  ?  <div>Authorizing...</div> :
                    error ? <div>Error :(</div> : (

                        <Suspense fallback={<p>Loading...</p>}>
                            {
                                userAuth.success ?
                                    <AuthenticatedApp userId={userAuth.user.id} onAuthChange={onAuthChange}/> :
                                    <UnauthenticatedApp onAuthChange={onAuthChange}/>
                            }

                        </Suspense>

                    )
                }

            </main>
        </div>
    )
}

export default App
