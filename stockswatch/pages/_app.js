import '../public/main.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // https://react-bootstrap.github.io/getting-started/introduction/

/**
 * Refer to https://nextjs.org/docs/advanced-features/custom-app
 */

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}