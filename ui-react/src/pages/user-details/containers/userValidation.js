export const validate = (name, value) => {
    let errors = {};

    if (name === "username") {
        if (!value) {
            errors.username = "Username is required";
        } else if (value.length < 3) {
            errors.username = "Username must be at least 3 characters long";
        }
    }

    if (name === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
            errors.email = "Email is not valid";
        }
    }

    if (name === "password") {
        if (!value) {
            errors.password = "Password is required";
        } else if (value.length < 6) {
            errors.password = "Password must be at least 6 characters long";
        }
    }

    if (name === "age") {
        if (!value) {
            errors.age = "Age is required";
        } else if (isNaN(value)) {
            errors.age = "Age must be a number";
        } else if (value < 1 || value > 100) {
            errors.age = "Age must be between 1 and 100";
        }
    }

    if (name === "phone") {
        if (!value) {
            errors.phone = "Phone number is required";
        } else if (!/^\d+$/.test(value)) {
            errors.phone = "Phone number must be a number";
        } else if (value.length < 10 || value.length > 15) {
            errors.phone = "Phone number must be between 10 and 15 digits long";
        }
    }

    return errors;
};