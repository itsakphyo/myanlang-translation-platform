import React, { useEffect, useRef } from 'react';

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({ onUploadSuccess }) => {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();

  useEffect(() => {
    // Initialize the Cloudinary widget
    cloudinaryRef.current = (window as any).cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'dnxizfrxa', // Your Cloudinary cloud name
        uploadPreset: 'texta-proof-of-payments', // Your unsigned upload preset
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          console.log('Upload successful! Here is the file info: ', result.info);
          // Pass the secure URL back to the parent component
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
