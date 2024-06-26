import localFont from 'next/font/local';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select'
import styles from './style.module.css';
import buttonStyles from '../../styles/buttons.module.css';
import { LOWER_STACKS_REPORT_LIMIT, UPPER_STACKS_REPORT_LIMIT, ACCEPTED_CONDITIONS, LOWER_RESERVATIONS_REPORT_LIMIT, UPPER_RESERVATIONS_REPORT_LIMIT } from '../../constants/constants';

const STACKS_OPTIONS = [];
const CONDITIONS_OPTIONS = [];
const RESERVATIONS_OPTIONS = [];

const PRIMARY_COLOR = '#357251';
const SECONDARY_COLOR = '#58B282';
const TERTIARY_COLOR = '#9BD1B4';

for (let i = LOWER_STACKS_REPORT_LIMIT; i <= UPPER_STACKS_REPORT_LIMIT; i++) {
    STACKS_OPTIONS.push({ value: i, label: `${i}` });
}
ACCEPTED_CONDITIONS.forEach(condition => CONDITIONS_OPTIONS.push({ value: condition, label: `${condition}` }));
for (let i = LOWER_RESERVATIONS_REPORT_LIMIT; i <= UPPER_RESERVATIONS_REPORT_LIMIT; i++) {
    RESERVATIONS_OPTIONS.push({ value: i, label: `${i}` });
}

Modal.setAppElement('#__next');

export function ReportModal({ isOpen, setOpen, setReports }) {
    const [stacks, setStacks] = useState();
    const [conditions, setConditions] = useState();
    const [reservations, setReservations] = useState();
    const [isSubmitDisabled, setSubmitDisabled] = useState(true);

    const selectTheme = (theme) => ({
        ...theme,
        colors: {
            ...theme.colors,
            primary: PRIMARY_COLOR,
            primary25: TERTIARY_COLOR,
            primary50: SECONDARY_COLOR,
        },
    });

    const resetModal = () => {
        setStacks();
        setConditions();
        setReservations();
        setOpen(false);
    };

    const handleCancel = () => {
        resetModal();
    };

    const handleSubmit = () => {
        if (stacks !== undefined && stacks !== null) {
            fetch('/api/stacks', {
                method: 'PUT',
                body: JSON.stringify({ stacks: stacks.value }),
            })
                .then(res => res.json())
                .then(data => setReports(data));
        }

        if (conditions !== undefined && conditions !== null) {
            fetch('/api/conditions', {
                method: 'PUT',
                body: JSON.stringify({ conditions: conditions.value }),
            })
                .then(res => res.json())
                .then(data => setReports(data));
        }

        if (reservations !== undefined && reservations !== null) {
            fetch('/api/reservations', {
                method: 'PUT',
                body: JSON.stringify({ reservations: reservations.value }),
            })
                .then(res => res.json())
                .then(data => setReports(data));
        }

        resetModal();
    };

    useEffect(() => {
        if ((stacks === undefined || stacks === null) && (conditions === undefined || conditions === null) && (reservations === undefined || reservations === null)) {
            setSubmitDisabled(true);
        } else {
            setSubmitDisabled(false);
        }
    }, [stacks, conditions, reservations]);

    return (
        <Modal
            style={styles.modal}
            isOpen={isOpen}
            contentLabel='Submit Report'
        >
            <p className={styles.title}>GLP Status Report</p>

            <p className={styles.header}>How many stacks are there?</p>
            <Select
                key={`stacksSelect-${stacks}`}
                className={styles.select}
                options={STACKS_OPTIONS}
                theme={selectTheme}
                value={stacks}
                onChange={setStacks} />

            <p className={styles.header}>What are the court conditions?</p>
            <Select
                key={`conditionsSelect-${conditions}`}
                className={styles.select}
                options={CONDITIONS_OPTIONS}
                theme={selectTheme}
                value={conditions}
                onChange={setConditions} />

            <p className={styles.header}>How many courts are reserved?</p>
            <Select
                key={`reservationsSelect-${reservations}`}
                className={styles.select}
                options={RESERVATIONS_OPTIONS}
                theme={selectTheme}
                value={reservations}
                onChange={setReservations} />

            <button
                className={`${styles.button} ${buttonStyles.button}`}
                onClick={handleCancel}
            >
                Cancel
            </button>

            <button
                className={`${styles.button} ${buttonStyles.button}`}
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
            >
                Submit
            </button>
        </Modal>
    );
};
