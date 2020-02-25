import Layout from '../../components/Layout';
import Login from '../../components/user/Login';
import Notfound from '../../components/alert/Notfound';

import { isAuthenticated } from '../utils/auth';

/**
 * https://nextjs.org/docs/routing/introduction
 * 
 * This file is routed to /login
 * 
 * Renders the login page
 */

const Login = () => {
    return (
        !isAuthenticated() ?
        <Layout component={
            <Login />
        } /> :
        <Layout component={
            <Notfound />
        } />
    )
}

export default Login;