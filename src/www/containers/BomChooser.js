import {Alert, Button, Form, Accordion, Card} from "react-bootstrap"
import React, {useState, useEffect} from "react"

const BomChooser = (props) => {
    const [bomList, setBomList] = useState({data: []})
    const [bomName, setBomName] = useState("")
    const [message, setMessage] = useState(null)
    const [activeKey, setActiveKey] = useState("")
    const [isLoadingEffect, setIsLoadingEffect] = useState(false)

    const handleSubmit = async event => {
        event.preventDefault()
        setMessage({variant: "primary", message: "Creating new BOM..."})
        setBomName("")
        setActiveKey("")
        const result = await window.fetch(`/api/v1/bom`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: bomName})
        })
        if(result.status === 200) {
            const resBody = await result.json()
            if (resBody.success) {
                setMessage(null)
                await getBomList()
                props.onBomIdChange(resBody.id)
            } else {
                setMessage({variant: "danger", message: "Failed to create new BOM"})
            }
        }
        else {
            setMessage({variant: "danger", message: "Failed to create new BOM"})
        }
    }
    const getBomList = async () => {
        const result = await window.fetch(`/api/v1/bom`, {
            method: 'GET'
        })
        const resBody = await result.json()

        if(result.status === 200) {
            if (resBody.success) {
                setBomList(resBody)
                setMessage(null)
            } else {
                setBomList({data: []})
            }
        }
        else {
            setBomList({data: []})
            setMessage({variant: "danger", message: "Failed to create new BOM"})
        }
    }

    useEffect( ()=> {

        const runAsync = async () => {
            setIsLoadingEffect(true)
            await getBomList()
            setIsLoadingEffect(false)
        }
        runAsync()
    }, [])


    function validateForm() {
        return bomName.length > 0
    }
    return (
        <div className="BomChooser">
            {message === null ? ("") : <Alert variant={message.variant}>{message.message}</Alert>}
            <form onSubmit={handleSubmit}>
                <Form.Group controlId="bomchooser-new-bom-name" size="lg">

                    <Accordion activeKey={activeKey}>
                        <Card>
                            <Accordion.Toggle as={Button} variant="link"  eventKey="0" onClick={()=>{setActiveKey("0")}}>
                                <Card.Header>
                                    <Form.Label>New Bom</Form.Label>
                                </Card.Header>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Form.Control
                                        placeholder="New Bom Name"
                                        value={bomName}
                                        onChange={e => setBomName(e.target.value)}
                                    />
                                    <Button block size="lg" disabled={!validateForm()} type="submit">
                                        Create New Bom
                                    </Button>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Form.Group>
                <Form.Group controlId="bomchooser-select-bom" size="lg">
                    <Form.Label>Choose a saved Bom</Form.Label>
                    <Form.Control
                        as="select"
                        autoFocus
                        onChange={e => {props.onBomIdChange(e.target.value)}}
                        value={isLoadingEffect ? "loading" : (bomList.data.length > 0 ? props.bomId : "no-boms") }
                    >
                        {   isLoadingEffect ?
                            <option value="loading">Loading...</option>
                            : bomList.data.length > 0 ?
                                bomList.data.map((item, idx) => {
                                        if(props.bomId === "" && idx === 0) {
                                            props.onBomIdChange(item.id)
                                        }
                                        return (
                                            <option key={`bom-names-${item.id}`} value={item.id}>
                                                {item.name}
                                            </option>
                                        )
                                    }
                                )
                                :  <option value="no-boms">-- no BOMs created --</option>
                        }
                    </Form.Control>
                </Form.Group>
            </form>
        </div>
    )
}

export default BomChooser