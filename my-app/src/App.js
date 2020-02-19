import React, { Component } from "react"
import logo from "./logo.svg"
import "./App.css"
import Model from './Model.js'

export default class App extends Component {
  render() {
    return (
      <div>
        <Model>
          {output => (
            <p>{output}</p>
          )}
        </Model>
      </div>
    )
  }
}
