import localFont from 'next/font/local';
import '../styles/global.css';
import '../styles/variables.css';

const FONT = localFont({ src: '../public/lilita.ttf' })

export default function App({ Component, pageProps }) {
    return (
        <main className={FONT.className}>
            <Component {...pageProps} />
        </main>
    );
}
