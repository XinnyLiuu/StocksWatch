import Layout from "../components/Layout";
import React from "react";

import Wrapper from "../components/highcharts/Wrapper";
import WatchlistCharts from "../components/highcharts/WatchlistCharts";

import { isAuthenticated } from '../utils/auth';

/**
 * Refer to https://nextjs.org/docs/basic-features/pages
 * 
 * This file is routed to /
 * 
 * Depending on whether or not the user is authenticated, show a different chart
 */

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authenticated: false
        }
    }

    componentDidMount() {
        if (isAuthenticated()) this.setState({ authenticated: true });
    }

    render() {
        if (this.state.authenticated) {
            return <Layout component={
                <WatchlistCharts api={process.env.post_user_watchlist_url} />}
            />;
        }

        return <Layout component={
            <Wrapper api={process.env.get_dow30_stock_url} symbol="" />}
        />;
    }
}

export default Home;