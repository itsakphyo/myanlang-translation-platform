import React, { useState, useRef, useEffect } from 'react';
import { TextField, Stack } from '@mui/material';

interface VerificationCodeInputProps {
  onChange: (value: string) => void;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({ onChange }) => {
  const [digits, setDigits] = useState<string[]>(Array(5).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [submittedCode, setSubmittedCode] = useState('');

  const handleInput = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const digit = e.target.value.slice(-1).replace(/[^0-9]/g, '');
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    if (digit && index < 4) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      e.preventDefault();
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 0);
    }
  };

  useEffect(() => {
    const currentCode = digits.join('');
    if (digits.every(digit => digit !== '')) {
      if (currentCode !== submittedCode) {
        setSubmittedCode(currentCode);
        onChange(currentCode);
      }
    } else if (submittedCode !== '') {
      setSubmittedCode('');
    }
  }, [digits, onChange, submittedCode]);

  return (
    <Stack direction="row" spacing={2} justifyContent="center" sx={{ my: 2 }}>
      {[0, 1, 2, 3, 4].map((index) => (
        <TextField
          key={index}
          inputRef={(el) => {
            if (el) inputRefs.current[index] = el;
          }}
          value={digits[index] || ''}
          onChange={handleInput(index)}
          onKeyDown={handleKeyDown(index)}
          variant="outlined"
          inputProps={{
            maxLength: 1,
            style: {
              textAlign: 'center',
              fontSize: '1.5rem',
              padding: '8px',
              width: '40px',
              height: '40px',
            },
          }}
        />
      ))}
    </Stack>
  );
};

export default VerificationCodeInput;
