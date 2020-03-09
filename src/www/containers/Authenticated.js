import BomChooser from "./BomChooser"
import BomFiller from './BomFiller'
import React, {useState} from 'react'

const Authenticated = props => {
    const [bomId, setBomId] = useState("")

    const onBomIdChange = (newBomId) => {
        setBomId(newBomId)
    }

    return (
        <div className="Authenticated">
            <BomChooser userId={props.userId} bomId={bomId} onBomIdChange={onBomIdChange} />
            {bomId !== "" ? <BomFiller bomId={bomId} /> : ("")}
        </div>
    )
}
export default Authenticated
