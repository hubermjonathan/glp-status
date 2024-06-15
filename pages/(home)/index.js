import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ReportModal, ReportText } from '../../components';
import styles from './style.module.css';
import buttonStyles from '../../styles/buttons.module.css';

export default function Home() {
    const [reports, setReports] = useState();
    const [isReportModalOpen, setReportModalOpen] = useState(false);

    const handleSubmit = () => {
        setReportModalOpen(true);
    };

    useEffect(() => {
        fetch('/api/reports')
            .then(res => res.json())
            .then(data => setReports(data));
    }, []);

    return (
        <>
            <div className={styles.container}>
                <Head>
                    <title>GLP Stacks</title>
                    <link rel='icon' href='/favicon.ico' />
                </Head>

                <Image
                    src="/glp.png"
                    width={276}
                    height={100}
                    alt="GLP logo"
                />

                <ReportText reports={reports} />

                <button
                    className={buttonStyles.button}
                    onClick={handleSubmit}
                >
                    Submit a Report
                </button>

                <ReportModal isOpen={isReportModalOpen} setOpen={setReportModalOpen} setReports={setReports} />
            </div>

            <div className={styles.footer}>
                <p>💚 Bentley and Jon</p>
            </div>
        </>
    );
};
