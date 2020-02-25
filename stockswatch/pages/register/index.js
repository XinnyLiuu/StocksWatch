import Layout from '../../components/Layout';
import Register from '../../components/user/Register';
import Notfound from '../../components/alert/Notfound';

import { isAuthenticated } from '../utils/auth';

/**
 * https://nextjs.org/docs/routing/introduction
 * 
 * This file is routed to /register
 * 
 * Renders the register page
 */

const Register = () => {
    return (
        !isAuthenticated() ?
        <Layout component={
            <Register />
        } /> :
        <Layout component={
            <Notfound />
        } />
    )
}

export default Register;