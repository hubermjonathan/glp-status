import { useEffect, useState } from 'react';
import styles from './style.module.css';

const LAST_REPORT_TEXT_FORMAT = 'Last reported {}';
const PDT_OFFSET = -7;
const PST_OFFSET = -8;

export function LastReportText({ reports }) {
    const [text, setText] = useState();

    const getMostRecentReportTime = (reports) => {
        const latestStacksReportTime = reports?.stacks?.[0].report_time ?? 0;
        const latestConditionsReportTime = reports?.conditions?.[0].report_time ?? 0;
        const latestReservationsReportTime = reports?.reservations?.[0].report_time ?? 0;

        return Math.max(latestStacksReportTime, latestConditionsReportTime, latestReservationsReportTime);
    };

    const convertReportTimeToDate = (reportTime) => {
        const currentDate = new Date();
        const currentEpoch = Math.floor(currentDate.getTime() / 1000);
        const reportTimeDifference = currentEpoch - reportTime;
    
        if (reportTimeDifference < 60) {
           return 'moments ago';
        }

        if (reportTimeDifference < 3600) {
            const numberOfMinutes = Math.floor(reportTimeDifference / 60); 

            if (numberOfMinutes === 1) {
                return `${numberOfMinutes} minute ago`;
            }

            return `${numberOfMinutes} minutes ago`;
        }

        return 'more than an hour ago';
    };

    useEffect(() => {
        const latestReportTime = getMostRecentReportTime(reports);

        if (!latestReportTime) {
            return;
        }

        const readableReportDate = convertReportTimeToDate(latestReportTime, PDT_OFFSET);

        setText(LAST_REPORT_TEXT_FORMAT.replace(/{}/g, readableReportDate));
    }, [reports]);

    if (text) {
        return <div className={styles.text}>{text}</div>;
    } else {
        return <></>;
    }
};
