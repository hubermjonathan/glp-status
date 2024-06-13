import { useState, useEffect } from 'react';
import Head from 'next/head';
import Select from 'react-select'
import styles from '../styles/Stacks.module.css';

const PRIMARY_COLOR = '#357251';
const SECONDARY_COLOR = '#58B282';
const TERTIARY_COLOR = '#9BD1B4';
const STACKS_TEXT = 'There are {} stacks at GLP';
const UNKNOWN_STACKS_TEXT = 'No reported stacks at GLP';
const SINGLE_STACK_TEXT = 'There is 1 stack at GLP';
const LOWER_STACK_REPORT_LIMIT = 0;
const UPPER_STACK_REPORT_LIMIT = 20;
const STACK_REPORT_TEXT = 'How many stacks are there?';
const STACK_REPORT_OPTIONS = [];
const STACK_EMOJIS = [
    {
        threshold: 0,
        emoji: '🤷',
    },
    {
        threshold: 2,
        emoji: '😶‍🌫️',
    },
    {
        threshold: 5,
        emoji: '😄',
    },
    {
        threshold: 7,
        emoji: '🙃',
    },
    {
        threshold: 10,
        emoji: '😕',
    },
    {
        threshold: 15,
        emoji: '😞',
    },
    {
        threshold: 20,
        emoji: '🤮',
    },
    {
        emoji: '😵',
    },
];

for (let i = LOWER_STACK_REPORT_LIMIT; i <= UPPER_STACK_REPORT_LIMIT; i++) {
    STACK_REPORT_OPTIONS.push({ value: i, label: `${i}` });
}

export default function Stacks() {
    const [stacksLength, setStacksLength] = useState(-1);
    const [stackReport, setStackReport] = useState();

    const stackReportTheme = (theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
            ...theme.colors,
            primary: PRIMARY_COLOR,
            primary25: TERTIARY_COLOR,
            primary50: SECONDARY_COLOR,
        },
    });

    const renderStacksText = () => {
        let stacksText = STACKS_TEXT.replace(/{}/g, stacksLength);

        if (stacksLength === -1) {
            stacksText = UNKNOWN_STACKS_TEXT;
        }

        if (stacksLength === 1) {
            stacksText = SINGLE_STACK_TEXT;
        }

        return <h1 className={styles.title}>{stacksText}</h1>
    };

    const renderStacksEmoji = () => {
        let stacksEmoji;

        for (const emoji of STACK_EMOJIS) {
            if (emoji.threshold === undefined) {
                stacksEmoji = emoji.emoji;

                break;
            }

            if (emoji.threshold > stacksLength) {
                stacksEmoji = emoji.emoji;

                break;
            }
        }

        return <h1 className={styles.title}>{stacksEmoji}</h1>;
    };

    const handleSubmit = () => {
        fetch('/api/submitStackReport', {
            method: 'POST',
            body: JSON.stringify({ numberOfStacks: stackReport.value }),
        })
            .then(res => res.json())
            .then(data => setStacksLength(data));

        setStackReport(undefined);
    };

    useEffect(() => {
        fetch('/api/getStacks')
            .then(res => res.json())
            .then(data => setStacksLength(data));
    }, []);

    return (
        <div>
            <div className={styles.container}>
                <Head>
                    <title>GLP Stacks</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main>
                    {renderStacksEmoji()}
                    {renderStacksText()}

                    <h1 className={styles.description}>{STACK_REPORT_TEXT}</h1>
                    <div className={styles.form}>
                        <Select
                            key={`stackReportSelect-${stackReport}`}
                            className={styles.select}
                            options={STACK_REPORT_OPTIONS}
                            theme={stackReportTheme}
                            value={stackReport}
                            onChange={setStackReport} />
                        <button
                            className={styles.button}
                            disabled={stackReport === undefined || stackReport === null}
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </main>
            </div>

            <div className={styles.footer}>
                <h1>💚 Bentley and Jon</h1>
            </div>
        </div>
    );
};
