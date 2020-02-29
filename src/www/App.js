import React, { Component } from 'react'
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import './App.css'

class App extends Component {
    constructor (props) {
        super(props)
        this.state = {
            userId: 1,
            bomId: 1,
            grid: []
        }
        this.addRow = this.addRow.bind(this)
        this.updateRefDes = this.updateRefDes.bind(this)
        this.updateQty = this.updateQty.bind(this)
        this.removeRow = this.removeRow.bind(this)
        this.updateGrid = this.updateGrid.bind(this)
        this.addDelComponent =this.addDelComponent.bind(this)
    }

    async removeRow(entryId) {
        const result = await window.fetch(`/api/v1/bom/${this.state.bomId}/${entryId}`, {
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
        let { grid } = await window.fetch(`/api/v1/bom/${this.state.bomId}`).then(res => res.status === 404 ? {grid: []} : res.json())
        grid = this.addDelComponent(grid)
        this.setState({ grid })
    }
    componentDidMount = async () => {
        this.updateGrid()
    }

    async addRow() {
        await window.fetch(`/api/v1/bom/${this.state.bomId}`, {method: 'POST'}).then(async (res) => {
            if (res.status === 200) {
                this.updateGrid()
            }
        })
    }

    async updateRefDes(entryId, refDes) {
        const result = await window.fetch(`/api/v1/bom/${this.state.bomId}/${entryId}/ref-des`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({refDes: refDes})
        })
        if (!result.json().success) {
            await this.updateGrid()
        }
    }
    async updateQty(entryId, qty) {
        const result = await window.fetch(`/api/v1/bom/${this.state.bomId}/${entryId}/qty`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({qty: parseInt(qty)})
        })
        if (!result.json().success) {
            await this.updateGrid()
        }
    }


    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>Bill of Materials Auto Filler</h1>
                    <p>
                        Columns headers in green have been implemented with database backend.
                        So have the + and - buttons.
                        The rest is a work in progress.
                    </p>
                </header>
                <main>
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
                                switch(col) {
                                    case 0 :
                                        this.updateRefDes(cell.entry, value).then()
                                        break;
                                    case 1 :
                                        this.updateQty(cell.entry, value).then()
                                        break;
                                }
                            })
                            this.setState({grid})
                        }}
                    />
                    <button className={'add-button'} onClick={this.addRow}>
                        +
                    </button>
                </main>
            </div>
        )
    }
}

export default App
