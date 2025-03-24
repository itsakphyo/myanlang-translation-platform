import React from "react";

export const CustomFlags = {
  Myanmar: (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" width="24" height="16">
      <rect width="36" height="8" fill="#FECB00" />
      <rect width="36" height="8" y="8" fill="#34B233" />
      <rect width="36" height="8" y="16" fill="#EA2839" />
      <path d="M18,4 L19.5,8.5 L24,8.5 L20.5,11.5 L22,16 L18,13 L14,16 L15.5,11.5 L12,8.5 L16.5,8.5 Z" fill="white" />
    </svg>
  ),
  
  UK: (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" width="24" height="16">
      <rect width="36" height="24" fill="#012169" />
      <path d="M0,0 L36,24 M36,0 L0,24" stroke="white" strokeWidth="4" />
      <path d="M0,0 L36,24 M36,0 L0,24" stroke="#C8102E" strokeWidth="2" />
      <path d="M18,0 L18,24 M0,12 L36,12" stroke="white" strokeWidth="6" />
      <path d="M18,0 L18,24 M0,12 L36,12" stroke="#C8102E" strokeWidth="3" />
    </svg>
  ),
};