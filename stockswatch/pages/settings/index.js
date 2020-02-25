import Layout from '../../components/Layout';
import Setting from '../../components/user/Setting';
import Notfound from '../../components/alert/Notfound';

import { isAuthenticated } from '../../utils/auth';

/**
 * https://nextjs.org/docs/routing/introduction
 * 
 * This file is routed to /settings
 * 
 * Renders the settings page
 */

const Settings = () => {
    return (
        isAuthenticated() ?
            <Layout component={
                <Setting />
            } /> :
            <Layout component={
                <Notfound />
            } />
    )
}

export default Settings;