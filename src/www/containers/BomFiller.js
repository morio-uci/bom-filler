import React from 'react'
import Alert from 'react-bootstrap/Alert'
import {useState, useEffect} from 'react'
import ReactDataSheet from "react-datasheet"
import 'react-datasheet/lib/react-datasheet.css'
import './BomFiller.css'
import {useQuery, useMutation} from 'react-apollo'
import { gql } from 'apollo-boost'

const BomFiller = props => {
    const GRID_QUERY = gql`
        query GetGrid($bomId: ID!) {
            bomGetGrid(bomId: $bomId) {
                success       
                grid {
                    __typename
                    ...on GridRowString {
                        entryId
                        string
                    }
                    ...on GridRowBoolean {
                        entryId
                        boolean
                    }
                    ...on GridRowInt {
                        entryId
                        int
                    }
                    ...on GridRowFloat {
                        entryId
                        float
                    }
                }
            }
        }
    `

    const ADD_ROW = gql`
        mutation BomCreateRow($bomId: ID!) {
            bomCreateRow(bomId: $bomId) {
                success
                bomId
                entryId
            }
        }
    `

    const DELETE_ROW = gql`
        mutation BomDeleteRow($entryId: ID!) {
            bomDeleteRow(entryId: $entryId) 
        }
    `

    const UPDATE_ROW = gql`
        mutation BomUpdateRow($row: UpdateRowInput!) {
            bomUpdateRow(updateRowInput: $row) {
                success
                entryId
            }
        }      
    `
    const [grid, setGrid] = useState([])
    const [initialLoading, setInitialLoading] = useState(true)
    const [message, setMessage] = useState(null)

    const {loading: gridLoading, error: gridQueryError, refetch: updateGrid } = useQuery(GRID_QUERY, {
        notifyOnNetworkStatusChange: true,
        variables: { bomId: props.bomId },
        onCompleted: ({bomGetGrid}) =>  {
            if (bomGetGrid.success) {
                setGrid(decorateGrid(bomGetGrid.grid))
            }
            else {
                setMessage({variant: "danger", text: "Errored when fetching the bom data"})
                setGrid([])
            }
        }
    })

    const [addRow, {loading: addingRow, error: addRowError}] = useMutation(ADD_ROW, {
        onCompleted: async ({bomCreateRow}) => {
            if (bomCreateRow.success) {
                setMessage(null)
                await updateGrid( {bomId: props.bomId})
            }
            else {
                setMessage({variant: "danger", text: "Error deleting the row"})
                setGrid([])
            }
        }
    })

    const [updateRow, {loading: updatingRow, error: updateRowError}] = useMutation(UPDATE_ROW, {
        onCompleted: async ({bomUpdateRow}) => {
            if (bomUpdateRow.success)  {
                setMessage(null)
            }
            else {
                setMessage({variant: 'danger', text: "There was an issue updating a cell's data"})
            }
            await updateGrid({bomId: props.bomId})
        }
    })

    const [deleteRow,{loading: deletingRow, error: deleteRowError}] = useMutation(DELETE_ROW, {
        onCompleted: async ( {bomDeleteRow}) => {
            if (bomDeleteRow) {
                setMessage(null)
                await updateGrid({bomId: props.bomId})
            }
            else {
                setMessage({variant: "danger", text: "Error deleting the row"})
                setGrid([])
            }
        }
    })

    useEffect(()=>{
        if (!gridLoading && initialLoading){
            setInitialLoading(false)
        }
    }, [gridLoading, initialLoading]);

    const decorateGrid = (orignalGrid) => addDelComponent(orignalGrid)

    const addDelComponent = (grid) => {
        return grid.map((row) => {
            let last = {}
            last.component = (
                <button className={'del-button'}
                        onClick={async ()=>{await deleteRow({variables: {entryId: row[0].entryId}})}}
                >−</button>
            )
            last.forceComponent = true
            return [...row, last]
        })
    }

    // this is a weird one, signature is fnCellValue(cell, fn) or fnCellValue(cell, set, ...value, fn)
    // first just returns fn(cell, cell.<type>)
    // the other sets cell.<type> to fn(cell, cell.<type>, ...value> to value or null if value is not in the parameter list
    // if set is true otherwise it just returns fn(cell, cell.<type>, ...value)

    const fnCellValue = (...args) => {
        const fn = args.pop()
        const cell = args.shift()
        const set = args.length > 0 ? args.shift() : false;
        const value = args.length > 0 ? args : null;
        let type = 'string'
        switch (cell.__typename) {
            case 'GridRowInt' :
                type = 'int'
                break;
            case 'GridRowBoolean' :
                type = 'boolean'
                break;
            case 'GridRowFloat' :
                type = 'float'
                break;
            case 'GridRowString' :
            default:
                // already set to 'string'
        }
        return set ? (
            value === null ?
                cell[type] = fn(cell, cell[type])
                : cell[type] = fn(cell, cell[type], ...value)
            )
            : fn(cell, cell[type])
    }
    const cellValue = cell => fnCellValue( cell, (_, cValue) => cValue )


    const setCellValue = (cell, value) => fnCellValue( cell, true, value, (_, __, newValue) => newValue )


    return (
        <div className="BomFiller">
            <p>
                Columns headers in green have been implemented with database backend.
                So have the + and - buttons.
                The rest is a work in progress.
            </p>
            {gridQueryError && <Alert variant="danger">Error occurred while fetching the bom data</Alert> }
            {deleteRowError && <Alert variant="danger">Error while deleting the row</Alert> }
            {message !== null && <Alert variant={message.variant}>{message.text}</Alert> }
            {initialLoading ?
                <Alert>Loading...</Alert> :
                <ReactDataSheet
                    data={grid}
                    valueRenderer={(cell) => cellValue(cell)}
                    sheetRenderer={props => (
                        <table className={props.className}>
                            <thead>
                            <tr>
                                <th className={'implemented'}>RefDes</th>
                                <th className={'implemented'}>Qty</th>
                                <th>MPN</th>
                                <th>Manufacture</th>
                                <th>Description</th>
                                <th>Footprint</th>
                                <th>Pins</th>
                            </tr>
                            </thead>
                            <tbody>
                            {props.children}
                            </tbody>
                        </table>
                    )}
                    onCellsChanged={async changes => {
                        const newGrid = grid.map(row => [...row])
                        const changePromises = []
                        const colKeyMap = ['refDes', 'qty', 'mpn', 'manufacture', 'description', 'footprint', 'pins']
                        changes.forEach(({cell, row, col, value}) => {
                            let skip = false

                            // white list working tags
                            if(!['qty', 'refDes'].includes(colKeyMap[col]) ){
                                skip = true
                            }

                            if (['qty', 'pins'].includes(colKeyMap[col])) {
                                value = parseInt(value, 10)
                                if(isNaN(value)){
                                    skip = true
                                }
                            }



                            if(!skip) {
                                newGrid[row][col] = {...grid[row][col]}
                                setCellValue(newGrid[row][col], value)
                                let varValue = newGrid[row][col]
                                const entryId = varValue.entryId
                                delete varValue['__typename']
                                changePromises.push(updateRow(
                                    {
                                        variables:
                                            {row: {entryId, [colKeyMap[col]]: varValue}}
                                    }
                                ))
                            }
                        })
                        setGrid(newGrid)
                        await Promise.all(changePromises)
                    }}

                />
            }

            <button className={'add-button'}
                    onClick={async ()=>{await addRow({variables: {bomId: props.bomId}})}}
            >+</button>
        </div>
    )
}

export default BomFiller