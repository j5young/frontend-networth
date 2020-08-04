import React, { Component } from 'react';
import ListNetWorthComponent from './ListNetWorthComponent';

export class NetWorthApp extends Component {
    render() {
        return (<>
            <h1>Tracking your Net Worth</h1>
            <ListNetWorthComponent />
          </>
      )
    }
}

export default NetWorthApp