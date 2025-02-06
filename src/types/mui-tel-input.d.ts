declare module 'mui-tel-input' {
  import { TextFieldProps } from '@mui/material';
  
  export interface MuiTelInputProps extends Omit<TextFieldProps, 'onChange'> {
    value: string;
    onChange: (value: string, info: { countryCode: string }) => void;
  }
  
  export function MuiTelInput(props: MuiTelInputProps): JSX.Element;
} 