"use client";

import React, { useEffect, useRef } from 'react';

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({ onUploadSuccess }) => {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();

  useEffect(() => {
    cloudinaryRef.current = (window as any).cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'dnxizfrxa', 
        uploadPreset: 'texta-proof-of-payments',
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          onUploadSuccess(result.info.secure_url);
        }
      }
    );
  }, [onUploadSuccess]);

  return (
    <div>
      <button onClick={() => widgetRef.current.open()}>Upload File</button>
    </div>
  );
};

export default CloudinaryUpload;
