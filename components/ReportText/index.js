import { useEffect, useState } from 'react';
import styles from './style.module.css';

const STACKS_TEXT_FORMAT = 'there are {} stacks';
const SINGLE_STACK_TEXT = 'there is 1 stack';
const CONDITIONS_TEXT_FORMAT = 'the courts are {}';
const RESERVATIONS_TEXT_FORMAT = '{} courts are reserved';
const SINGLE_RESERVATION_TEXT = '1 court is reserved';
const EVERYTHING_UNKNOWN_TEXT = 'No reports at the moment'

export function ReportText({ reports }) {
    const [text, setText] = useState();

    useEffect(() => {
        const stacks = reports?.stacks?.[0].value;
        const conditions = reports?.conditions?.[0].value;
        const reservations = reports?.reservations?.[0].value;

        if (!stacks && stacks !== 0 && !conditions && !reservations) {
            setText(EVERYTHING_UNKNOWN_TEXT);

            return;
        }

        let combinedText = '';

        if (stacks === 0) {
            combinedText += STACKS_TEXT_FORMAT.replace(/{}/g, 'no');
        } else if (stacks === 1) {
            combinedText += SINGLE_STACK_TEXT;
        } else if (stacks > 1) {
            combinedText += STACKS_TEXT_FORMAT.replace(/{}/g, stacks);
        }

        if (conditions) {
            if (combinedText) {
                combinedText += ' and ';
            }

            combinedText += CONDITIONS_TEXT_FORMAT.replace(/{}/g, conditions);
        }

        if (reservations || reservations === 0) {
            if (combinedText) {
                combinedText += ' and ';
            }

            if (reservations === 0) {
                combinedText += RESERVATIONS_TEXT_FORMAT.replace(/{}/g, 'no');
            } else if (reservations === 1) {
                combinedText += SINGLE_RESERVATION_TEXT;
            } else if (reservations > 1) {
                combinedText += RESERVATIONS_TEXT_FORMAT.replace(/{}/g, reservations);
            }
        }

        setText(combinedText.charAt(0).toUpperCase() + combinedText.slice(1));
    }, [reports]);

    return (
        <div className={styles.text}>{text}</div>
    );
};
