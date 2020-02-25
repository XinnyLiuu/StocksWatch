import Document, { Html, Head, Main, NextScript } from 'next/document'

/**
 * Refer to https://nextjs.org/docs/advanced-features/custom-document
 */

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html lang="en">
                <meta name="theme-color" content={"#343a40"} />
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument