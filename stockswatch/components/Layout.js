import React from 'react';

import Header from './Header';
import LoadingSpinner from "./LoadingSpinner";

/**
 * Defines the default layout for the site
 */

class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false, // Check if the component is rendered on the client side
        };
    }

    componentDidMount() {
        if (localStorage !== undefined) this.setState({ ready: true });
    }

    render() {
        // Check if the component has been rendered on the client
        if (!this.state.ready) return <LoadingSpinner />;

        return (
            <React.Fragment>
                <Header />
                {this.props.component}
            </React.Fragment>
        )
    }
}

export default Layout;