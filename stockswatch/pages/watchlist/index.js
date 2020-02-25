import Layout from '../../components/Layout';
import Watchlist from '../../components/user/Watchlist';
import Notfound from '../../components/alert/Notfound';

import { isAuthenticated } from '../utils/auth';

/**
 * https://nextjs.org/docs/routing/introduction
 * 
 * This file is routed to /watchlist
 * 
 * Renders the user's watchlist page
 */

const Watchlist = () => {
    return (
        isAuthenticated() ?
        <Layout component={
            <Watchlist />
        } /> :
        <Layout component={
            <Notfound />
        } />
    )
}

export default Watchlist;