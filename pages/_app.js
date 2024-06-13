import '../styles/global.css';
import { Lilita_One } from 'next/font/google';

const lilita = Lilita_One({
    weight: '400',
    subsets: ['latin']
});

export default function App({ Component, pageProps }) {
    return (
        <main className={lilita.className}>
            <Component {...pageProps} />
        </main>
    );
}
