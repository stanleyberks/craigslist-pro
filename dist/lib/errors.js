export class ApiRateLimitError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ApiRateLimitError';
    }
}
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
export class ConfigurationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConfigurationError';
    }
}
