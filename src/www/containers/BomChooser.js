import {Alert, Button, Form, Accordion, Card} from "react-bootstrap"
import React, {useState} from "react"
import { useQuery, useMutation } from 'react-apollo'
import { gql } from 'apollo-boost';

const BomChooser = (props) => {
    const BOM_LIST = gql`
        query BomList {
            bomList {
                success
                bomNames {
                    id
                    name
                }   
            }
        }
    `
    const CREATE_BOM = gql`
        mutation bomCreate($name: String!) {
            bomCreate(name: $name) {
                success
                bom {
                    id
                    name
                }
            }
        }
    `

    const {data, refetch: getBomList, loading: loadingBomList, error: bomListError} = useQuery(BOM_LIST)
    const [createBom, {loading: creatingBom, error: createBomError}] = useMutation(CREATE_BOM, {
        onCompleted: async ({bomCreate}) => {
            if (bomCreate.success) {
                props.onBomIdChange(bomCreate.bom.id)
                setBomName("")
                await getBomList()
            }
            else {
                setMessage({variant: "danger", message: "Failed to create new BOM"})
            }
        }})
    const [bomName, setBomName] = useState("")
    const [message, setMessage] = useState(null)
    const [activeKey, setActiveKey] = useState("")

    const handleSubmit = async event => {
        event.preventDefault()
        setActiveKey("")
        await createBom({variables: {name: bomName.trim()}})
    }

    function validateForm() {
        return bomName.length > 0
    }

    return (
        <div className="BomChooser">
            {message === null ? ("") : <Alert variant={message.variant}>{message.message}</Alert>}
            {createBomError && <Alert variant="danger">Error creating bom, try again</Alert>}
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
                                    <Button block size="lg" disabled={!validateForm() || creatingBom} type="submit">
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
                        value={props.bomId === '' ? "default" : props.bomId}
                        style={bomListError ? {color: "red"} : {}}
                        disabled = {loadingBomList || bomListError || creatingBom || props.bomId === ''}
                    >
                        { loadingBomList || creatingBom ? <option value={"default"}>Loading...</option>
                            : bomListError || ! data.bomList.success ? <option value="default">Error loading bom list</option>
                                : data.bomList.bomNames.length > 0
                                    ? data.bomList.bomNames.map((item, idx) => {
                                        if (props.bomId === "" && idx === 0) {
                                            props.onBomIdChange(item.id)
                                        }
                                        return (
                                            <option key={`bom-names-${item.id}`} value={item.id}>
                                                {item.name}
                                            </option>
                                        )
                                    })
                                    :  <option value="default">-- no BOMs created --</option>
                        }
                    </Form.Control>
                </Form.Group>
            </form>
        </div>
    )
}

export default BomChooser