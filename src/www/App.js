import React, { Component } from 'react'
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import logos from './logos.svg'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      count: 'loading...',
      grid: [
        [{value: 1}, {value: 3},{value:5},{value:6},{value:7}],
        [{value: 2}, {value: 4},{value:5},{value:6},{value:7}]
      ]
    }
  }

  componentDidMount = async () => {
    const { count } = await window.fetch(`/api/count`).then(res => res.json())
    this.setState({ count })
  }

  increment = async () => {
    const { count } = await window
      .fetch(`/api/count/increment`, { method: 'POST' })
      .then(res => res.json())
    this.setState({ count })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logos} className="App-logo" alt="logo" />
          <p>
            {'Learn '}
            <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
              React
            </a>
            {', '}
            <a href="https://expressjs.com" target="_blank" rel="noopener noreferrer">
              Express
            </a>
            {', and '}
            <a href="https://kubernetes.io" target="_blank" rel="noopener noreferrer">
              Kubernetes
            </a>
          </p>
          <ReactDataSheet
              data={this.state.grid}
              valueRenderer={(cell) => cell.value}
              sheetRenderer={props => (
                  <table className={props.className}>
                    <thead>
                    <tr>
                      <th>RefDes</th>
                      <th>Qty</th>
                      <th>MPN</th>
                      <th>Manufacture</th>
                      <th>Description</th>
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
                })
                this.setState({grid})
              }}
          />
          <hr />
          <h2>Count: {this.state.count}</h2>
          <p>
            Call <code>/api/count/increment</code>
            <button onClick={this.increment} className="App-button">
              Go
            </button>
          </p>
        </header>
      </div>
    )
  }
}

export default App
