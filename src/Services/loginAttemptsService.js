class LoginAttempts {
    constructor() {
        this.attempts = new Map();
        this.blockedUsers = new Map();
    }

    addFailedAttempt(email) {
        const currentAttempts = this.attempts.get(email) || 0;
        const newAttempts = currentAttempts + 1;
        this.attempts.set(email, newAttempts);

        if (newAttempts >= 3) {
            const blockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
            this.blockedUsers.set(email, blockUntil);
            this.attempts.delete(email);
            return true;
        }
        return false;
    }

    isBlocked(email) {
        const blockUntil = this.blockedUsers.get(email);
        if (!blockUntil) return false;
        if (Date.now() > blockUntil) {
            this.blockedUsers.delete(email);
            return false;
        }
        return true;
    }

    resetAttempts(email) {
        this.attempts.delete(email);
        this.blockedUsers.delete(email);
    }

    getRemainingAttempts(email) {
        const attempts = this.attempts.get(email) || 0;
        return Math.max(0, 3 - attempts);
    }

    getBlockTimeRemaining(email) {
        const blockUntil = this.blockedUsers.get(email);
        if (!blockUntil) return 0;
        const remaining = blockUntil - Date.now();
        return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60)));
    }
}

const loginAttempts = new LoginAttempts();
export const addFailedAttempt = (email) => loginAttempts.addFailedAttempt(email);
export const isBlocked = (email) => loginAttempts.isBlocked(email);
export const resetAttempts = (email) => loginAttempts.resetAttempts(email);
export const getRemainingAttempts = (email) => loginAttempts.getRemainingAttempts(email);
export const getBlockTimeRemaining = (email) => loginAttempts.getBlockTimeRemaining(email);
