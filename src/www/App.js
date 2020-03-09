import React, { Component, Suspense } from 'react'
import {Navbar, Nav, Form, Button} from 'react-bootstrap'
import './App.css'
const AuthenticatedApp = React.lazy(() => import('./containers/Authenticated'))
const UnauthenticatedApp = React.lazy(() => import('./containers/Unauthenticated'))

class App extends Component {
    constructor (props) {
        super(props)
        this.state = {
            userAuth: null
        }
        this.authUser = this.authUser.bind(this)
        this.onAuthChange = this.onAuthChange.bind(this)
        this.logout = this.logout.bind(this)
    }

    authUser = async () => {
        try {
            const result = await window.fetch(`/api/v1/user/auth`)
            this.setState({userAuth: await result.json()})
        }
        catch (e) {
            console.log("Auth raised an error", e.message)
            this.setState( {userAuth: {success: false}})
        }
    }

    logout = async () => {
        try {
            await window.fetch(`/api/v1/user/logout`)
            this.setState( {userAuth: {success: false}})
        }
        catch (e) {
            console.log("Logout raised an error", e.message)
            this.setState( {userAuth: {success: false}})
        }
    }

    onAuthChange = (userAuth)=> {
        this.setState({ userAuth })
    }

    componentDidMount = async () => {
        this.authUser()
    }


    render = () => {
        return (

            <div className="App">
                <header>
                    <Navbar>
                        <Navbar.Brand href="#home">Bom Filler</Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                            {this.state.userAuth && this.state.userAuth.success ? <Nav >
                                <Navbar.Text>
                                    Signed in as: {this.state.userAuth.name}
                                </Navbar.Text>
                                <Form className="ml-1" inline>
                                    <Button variant="outline-primary" onClick={this.logout}>Logout</Button>
                                </Form>
                            </Nav> : ("")
                            }
                        </Navbar.Collapse>


                    </Navbar>
                </header>
                <main>
                    <Suspense fallback={<p>Loading...</p>} >
                        {this.state.userAuth !== null && this.state.userAuth.success ?
                            <AuthenticatedApp userId={this.state.userAuth.id} onAuthChange={this.onAuthChange}/> :
                            <UnauthenticatedApp onAuthChange={this.onAuthChange}/>
                        }
                    </Suspense>
                </main>
            </div>
        )
    }
}
export default App
