import Layout from '../../components/Layout';
import Wrapper from '../../components/highcharts/Wrapper';
import Notfound from '../../components/alert/Notfound';

import { isAuthenticated } from '../utils/auth';

/**
 * https://nextjs.org/docs/routing/introduction
 * 
 * This file is routed to /dow30
 * 
 * Renders the dow30 page
 */

const Dow30 = () => {
    return (
        isAuthenticated() ?
        <Layout component={
            <Wrapper />
        } /> :
        <Layout component={
            <Notfound />
        } />
    )
}

export default Dow30;