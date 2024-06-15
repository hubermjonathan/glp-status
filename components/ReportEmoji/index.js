import { useEffect, useState } from 'react';
import styles from './style.module.css';
import { LOWER_STACKS_REPORT_LIMIT, UPPER_STACKS_REPORT_LIMIT } from '../../constants/constants';

const EMOJI_LIMITS = [
    {
        threshold: LOWER_STACKS_REPORT_LIMIT,
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
        threshold: UPPER_STACKS_REPORT_LIMIT,
        emoji: '🤮',
    },
    {
        emoji: '😵',
    },
];

export function ReportEmoji({ reports }) {
    const [emoji, setEmoji] = useState(EMOJI_LIMITS[0].emoji);

    useEffect(() => {
        const numberOfStacks = reports?.stacks?.[0].value ?? -1;
        const conditions = reports?.conditions?.[0].value;

        for (const emojiLimit of EMOJI_LIMITS) {
            if (emojiLimit.threshold === undefined) {
                setEmoji(emojiLimit.emoji);

                break;
            }

            if (emojiLimit.threshold > numberOfStacks) {
                setEmoji(emojiLimit.emoji);

                break;
            }
        }
    }, [reports]);

    return (
        <div className={styles.emoji}>{emoji}</div>
    );
};
