import React from 'react'
import {Tabs, Tab} from "react-bootstrap"
import Login from "./Login"
import SignUp from "./SignUp"
const Unauthenticated = (props) => {
    return (

        <div className="Unauthenticated">
            <Tabs defaultActiveKey="login" id="authentication-tab">
                <Tab eventKey="login" title="Login">
                    <Login onAuthChange={props.onAuthChange}/>
                </Tab>
                <Tab eventKey="profile" title="Sign Up">
                    <SignUp onAuthChange={props.onAuthChange}/>
                </Tab>
            </Tabs>
        </div>
    )
}
export default Unauthenticated
