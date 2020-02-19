import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class RealTimeModel extends Component {
    static propTypes = {
        prop: PropTypes
    }

    componentDidMount(){
        window.setTimeout(() => this.setState({n: this.state.n}), 6000 / 30);
    }

    render() {
        return (
            <div>
                
            </div>
        )
    }
}
