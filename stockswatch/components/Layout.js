import React from 'react';
import Header from './Header';

/**
 * Defines the default layout for the site
 */

class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <React.Fragment>
                <Header />
                {this.props.component}
            </React.Fragment>
        )
    }
}

export default Layout;