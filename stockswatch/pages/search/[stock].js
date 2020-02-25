import { useRouter } from 'next/router'

import Wrapper from "../../components/highcharts/Wrapper";
import Layout from '../../components/Layout';

/**
 * Refer to https://nextjs.org/docs/routing/dynamic-routes
 * 
 * This file is routed to /search/:stock
 * 
 * Renders the stockchart for the target stock
 */

const Stock = () => {
    const router = useRouter();
    const { stock } = router.query;

    return (
        <Layout component={
            <Wrapper api={process.env.get_yearly_stock_url} symbol={stock} />
        } />
    )
}

export default Stock;