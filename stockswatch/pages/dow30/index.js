import React from 'react';

import Layout from '../../components/Layout';
import Wrapper from '../../components/highcharts/Wrapper';
import Notfound from '../../components/alert/Notfound';

import { isAuthenticated } from '../../utils/auth';

/**
 * https://nextjs.org/docs/routing/introduction
 * 
 * This file is routed to /dow30
 * 
 * Renders the dow30 page
 */
class Dow30 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authenticated: false,
            ready: false
        }
    }

    componentDidMount() {
        if (localStorage !== undefined) {
            this.setState({ ready: true });

            if (isAuthenticated()) this.setState({ authenticated: true });
        }
    }

    render() {
        if (!this.state.ready) return "";
        
        if (this.state.authenticated) {
            return <Layout component={
                <Wrapper api={process.env.get_dow30_stock_url} symbol="" />
            } />;
        }

        return <Layout component={
            <Notfound />
        } />;
    }
}

export default Dow30;