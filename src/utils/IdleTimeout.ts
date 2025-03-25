/* let timeout: number | undefined;

const IDLE_TIME = 60000;

const resetTimer = (callback: () => void) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        callback();
    }, IDLE_TIME);
};

const startListening = (callback: () => void) => {
    const reset = () => resetTimer(callback);
    document.addEventListener('mousemove', reset);
    document.addEventListener('keypress', reset);
    document.addEventListener('click', reset);
    document.addEventListener('scroll', reset);
};

const stopListening = () => {
    clearTimeout(timeout);
    document.removeEventListener('mousemove', reset);
    document.removeEventListener('keypress', reset);
    document.removeEventListener('click', reset);
    document.removeEventListener('scroll', reset);
};

export { startListening, stopListening }; */