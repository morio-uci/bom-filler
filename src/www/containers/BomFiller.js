import React, { Component } from 'react'
import Alert from 'react-bootstrap/Alert'
import ReactDataSheet from "react-datasheet"
import 'react-datasheet/lib/react-datasheet.css'
import './BomFiller.css'

class BomFiller extends Component {
    constructor (props) {
        super(props)
        this.state = {
            grid: [],
            isLoading: false
        }
        this.addRow = this.addRow.bind(this)
        this.updateRefDes = this.updateRefDes.bind(this)
        this.updateQty = this.updateQty.bind(this)
        this.removeRow = this.removeRow.bind(this)
        this.updateGrid = this.updateGrid.bind(this)
        this.addDelComponent =this.addDelComponent.bind(this)
    }

    async removeRow(entryId) {
        const result = await window.fetch(`/api/v1/bom/${this.props.bomId}/${entryId}`, {
            method: 'DELETE'
        })
        if((await result.json()).success){
            await this.updateGrid()
        }
    }

    addDelComponent = (grid) => {
        return grid.map((row) => {
            let last = {}
            last.component = (
                <button className={'del-button'} onClick={()=>{this.removeRow(row[0].entry).then()}}>−</button>
            )
            last.forceComponent = true
            return [...row, last]
        })
    }

    async updateGrid() {
        const result = await window.fetch(`/api/v1/bom/${this.props.bomId}`)
        if (result.status === 200) {
            const response = await result.json()
            if (response.success) {
                let grid = []
                grid = this.addDelComponent(response.grid)
                this.setState({ grid })
            }
            else {
                this.setState({ grid: [] })
            }
        }
        else {
            this.setState({ grid: [] })
        }


    }
    componentDidMount = async () => {
        await this.updateGrid()
    }

    componentDidUpdate = async (prevProps) => {
        const asyncCall = async () => {
            this.setState({isLoading: true})
            await this.updateGrid()
            this.setState({isLoading: false})
        }

        if(prevProps.bomId !== this.props.bomId) {
            await asyncCall()
        }
    }

    async addRow() {
        await window.fetch(`/api/v1/bom/${this.props.bomId}`, {method: 'POST'}).then(async (res) => {
            if (res.status === 200) {
                await this.updateGrid()
            }
        })
    }

    async updateRefDes(entryId, refDes) {
        const result = await window.fetch(`/api/v1/bom/${this.props.bomId}/${entryId}/ref-des`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({refDes: refDes})
        })
        if (! (await result.json()).success) {
            await this.updateGrid()
        }
    }
    async updateQty(entryId, qty) {
        const result = await window.fetch(`/api/v1/bom/${this.props.bomId}/${entryId}/qty`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({qty: parseInt(qty)})
        })
        if (! (await result.json()).success) {
            await this.updateGrid()
        }
    }


    render() {
        return (
            <div className="BomFiller">
                <p>
                    Columns headers in green have been implemented with database backend.
                    So have the + and - buttons.
                    The rest is a work in progress.
                </p>
                {this.state.isLoading ?
                    <Alert>Loading...</Alert> :
                    <ReactDataSheet
                        data={this.state.grid}
                        valueRenderer={(cell) => cell.value}
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
                        onCellsChanged={changes => {
                            const grid = this.state.grid.map(row => [...row])
                            changes.forEach(({cell, row, col, value}) => {
                                grid[row][col] = {...grid[row][col], value}
                                switch (col) {
                                    case 0 :
                                        this.updateRefDes(cell.entry, value).then()
                                        break;
                                    case 1 :
                                        this.updateQty(cell.entry, value).then()
                                        break;
                                    default :
                                }
                            })
                            this.setState({grid})
                        }}
                    />
                }
                <button className={'add-button'} onClick={this.addRow}>
                    +
                </button>
            </div>
        )
    }
}

export default BomFiller