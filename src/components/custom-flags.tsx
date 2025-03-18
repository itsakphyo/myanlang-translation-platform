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

  // Kachin flag
  Kachin: (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" width="24" height="16">
      {/* Red top half */}
      <rect width="36" height="12" fill="#FF0000" />
      {/* Green bottom half */}
      <rect width="36" height="12" y="12" fill="#008800" />
      {/* White crossed swords */}
      <g fill="white">
        {/* First sword */}
        <path d="M12,6 L24,18 L22.5,19.5 L10.5,7.5 Z" />
        <path d="M10.5,6 L12,7.5 L10.5,9 L9,7.5 Z" />
        {/* Second sword */}
        <path d="M24,6 L12,18 L10.5,16.5 L22.5,4.5 Z" />
        <path d="M25.5,6 L24,7.5 L25.5,9 L27,7.5 Z" />
      </g>
    </svg>
  ),
  
  // Chin National Front flag
  Chin: (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" width="24" height="16">
      {/* Red top third */}
      <rect width="36" height="8" fill="#E52D1D" />
      {/* White middle third */}
      <rect width="36" height="8" y="8" fill="#FFFFFF" />
      {/* Blue bottom third */}
      <rect width="36" height="8" y="16" fill="#1E3B8F" />
      {/* White circle in center */}
      <circle cx="18" cy="12" r="5" fill="#FFFFFF" />
      {/* Hornbill bird */}
      <g transform="translate(14.5,9) scale(0.15,0.15)">
        {/* Bird body */}
        <path d="M20,30 C20,30 25,40 35,40 C45,40 45,25 45,20 C45,15 40,10 30,10 C20,10 15,20 15,25 C15,30 20,30 20,30 Z" fill="black" />
        {/* Bird head */}
        <path d="M10,15 C10,15 5,10 5,5 C5,0 10,-5 15,-5 C20,-5 25,0 25,5 C25,10 20,15 15,15 C10,15 10,15 10,15 Z" fill="black" />
        {/* Yellow beaks */}
        <path d="M5,5 C5,5 -10,0 -15,5 C-20,10 -15,15 -10,15 C-5,15 0,10 5,5 Z" fill="#FFD700" />
        <path d="M25,5 C25,5 40,0 45,5 C50,10 45,15 40,15 C35,15 30,10 25,5 Z" fill="#FFD700" />
        {/* Branch */}
        <path d="M15,40 C15,40 25,45 35,45 C45,45 55,40 55,40" stroke="#8D9B6A" strokeWidth="3" fill="none" />
        {/* Feet */}
        <path d="M25,40 L25,50 M30,40 L30,50 M35,40 L35,50" stroke="black" strokeWidth="2" fill="none" />
      </g>
    </svg>
  ),
};