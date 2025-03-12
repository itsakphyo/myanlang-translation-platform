export const getPasswordRequirements = (password: string) => [
  {
    text: 'At least 8 characters',
    valid: password.length >= 8,
    checked: password.length >= 8,
  },
  {
    text: 'One uppercase letter',
    valid: /[A-Z]/.test(password),
    checked: /[A-Z]/.test(password),
  },
  {
    text: 'One lowercase letter',
    valid: /[a-z]/.test(password),
    checked: /[a-z]/.test(password),
  },
  {
    text: 'One number',
    valid: /[0-9]/.test(password),
    checked: /[0-9]/.test(password),
  },
  {
    text: 'One special character (!@#$%^&*)',
    valid: /[!@#$%^&*]/.test(password),
    checked: /[!@#$%^&*]/.test(password),
  },
];


