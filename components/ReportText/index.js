import { useEffect, useState } from 'react';
import styles from './style.module.css';

const STACKS_TEXT_FORMAT = 'There are {} stacks';
const UNKNOWN_STACKS_TEXT = 'No stacks have been reported';
const SINGLE_STACK_TEXT = 'There is 1 stack';
const CONDITIONS_TEXT_FORMAT = 'the courts are {}';
const UNKNOWN_CONDITIONS_TEXT = 'no conditions have been reported';
const EVERYTHING_UNKNOWN_TEXT = 'No reports at the moment'

export function ReportText({ reports }) {
    const [text, setText] = useState();

    useEffect(() => {
        const numberOfStacks = reports?.stacks?.[0].value ?? -1;
        const conditions = reports?.conditions?.[0].value;

        if (numberOfStacks === -1 && !conditions) {
            setText(EVERYTHING_UNKNOWN_TEXT);

            return;
        }

        let combinedText;

        if (numberOfStacks === -1) {
            combinedText = UNKNOWN_STACKS_TEXT;
        } else if (numberOfStacks === 1) {
            combinedText = SINGLE_STACK_TEXT;
        } else {
            combinedText = STACKS_TEXT_FORMAT.replace(/{}/g, numberOfStacks);
        }

        combinedText += " and ";

        if (conditions) {
            combinedText += CONDITIONS_TEXT_FORMAT.replace(/{}/g, conditions);
        } else {
            combinedText += UNKNOWN_CONDITIONS_TEXT;
        }

        setText(combinedText);
    }, [reports]);

    return (
        <div className={styles.text}>{text}</div>
    );
};
