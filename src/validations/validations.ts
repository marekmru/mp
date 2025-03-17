// src/validations/validations.ts
import * as yup from 'yup';

export const loginValidationSchema = yup.object({
    username: yup.string().required('Username is required').max(100, 'Username must be less than 100 characters'),
    password: yup.string().required('Password is required').min(2, 'Password must be at least 2 characters'),
});



// Füge hier weitere Validierungsschemata hinzu