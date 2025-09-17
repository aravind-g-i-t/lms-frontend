export const validateEmail = (email: string): string => {
    if (!email.trim()) {
        return  'Email is required'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return  'Please enter a valid email address'
    }
    return '';
};



export const validatePassword = (password: string): string => {
    if (!password.trim()) {
        return  'Password is required'
    }
    if (password.length < 8) {
        return  'Password must be at least 8 characters long'
    }
    if (!/(?=.*[a-z])/.test(password)) {
        return  'Must contain a lowercase letter'
    }
    if (!/(?=.*[A-Z])/.test(password)) {
        return  'Must contain an uppercase letter'
    }
    if (!/(?=.*\d)/.test(password)) {
        return  'Must contain a number'
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
        return  'Must contain a special character'
    }
    return '';
};

export const validateConfirmPassword = (confirmPassword: string, password: string): string => {
    if (!confirmPassword.trim()) {
        return  'Please confirm your password'
    }
    if (confirmPassword !== password) {
        return 'Passwords do not match';
    }
    return '';
};

export const validateTextField = (fieldName:string,text:string): string => {

    if (!text.trim()) {
      return  `${fieldName} is required`;
    }
    return '';
};
