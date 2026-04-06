export const usePasswordStrength = (password: string) => {
    const checks = {
        length: password.length >= 8,
        number: /[0-9]/.test(password),
        symbol: /[!@#$%^&*]/.test(password),
        upper: /[A-Z]/.test(password),
    };

    const strengthCount = Object.values(checks).filter(Boolean).length;

    return { checks, strengthCount };
};