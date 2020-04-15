export const sync = ({ getState }) => (next) => (action) => {
    next(action);

    const state = JSON.stringify(getState());

    localStorage.setItem('@@sirintesttaskstorage', state);
};
