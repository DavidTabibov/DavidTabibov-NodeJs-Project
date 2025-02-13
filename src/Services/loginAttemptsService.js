class LoginAttempts {
    constructor() {
        this.attempts = new Map();
        this.blockedUsers = new Map();
    }

    // Record a failed attempt
    addFailedAttempt(email) {
        const currentAttempts = this.attempts.get(email) || 0;
        const newAttempts = currentAttempts + 1;
        this.attempts.set(email, newAttempts);

        // If 3 failed attempts, block the user
        if (newAttempts >= 3) {
            const blockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
            this.blockedUsers.set(email, blockUntil);
            this.attempts.delete(email); // Reset attempts
            return true; // User is now blocked
        }
        return false;
    }

    // Check if user is blocked
    isBlocked(email) {
        const blockUntil = this.blockedUsers.get(email);
        if (!blockUntil) return false;

        if (Date.now() > blockUntil) {
            // Block period has expired
            this.blockedUsers.delete(email);
            return false;
        }
        return true;
    }

    // Reset attempts on successful login
    resetAttempts(email) {
        this.attempts.delete(email);
        this.blockedUsers.delete(email);
    }

    // Get remaining attempts
    getRemainingAttempts(email) {
        const attempts = this.attempts.get(email) || 0;
        return Math.max(0, 3 - attempts);
    }

    // Get block time remaining in hours
    getBlockTimeRemaining(email) {
        const blockUntil = this.blockedUsers.get(email);
        if (!blockUntil) return 0;

        const remaining = blockUntil - Date.now();
        return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60)));
    }
}

// Create a singleton instance
const loginAttempts = new LoginAttempts();

export default loginAttempts;