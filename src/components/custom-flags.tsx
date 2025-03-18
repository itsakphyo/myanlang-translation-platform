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
};

