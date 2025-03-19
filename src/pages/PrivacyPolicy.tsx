import React from "react";
import { Box } from "@mui/material";

const PrivacyPolicy: React.FC = () => {
  return (
    <Box
    sx={{
      display: "flex",
      ml: 10,
      mr: 10,
      mb: 10,
    }}>
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>
      <p className="mb-4 text-sm text-gray-500">Effective Date: March 18, 2025</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
        <p className="mb-3">
          Welcome to MyanLang. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
        </p>
        <p>
          By accessing or using MyanLang, you consent to the practices described in this policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
        <p className="mb-3">
          We may collect various types of information, including:
        </p>
        <ul className="list-disc list-inside mb-3">
          <li>
            <strong>Personal Information:</strong> Your name, email address, and other details provided during registration or communication.
          </li>
          <li>
            <strong>Usage Data:</strong> Information on how you access and interact with our platform, such as IP address, browser type, pages viewed, and time spent on pages.
          </li>
          <li>
            <strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to enhance your experience and analyze usage patterns.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
        <p className="mb-3">
          Your information is used for several purposes, including to:
        </p>
        <ul className="list-disc list-inside mb-3">
          <li>Operate and maintain the MyanLang platform.</li>
          <li>Improve and personalize your user experience.</li>
          <li>Process transactions and send related information, such as payment confirmations.</li>
          <li>Communicate with you about updates, promotions, or important notices.</li>
          <li>Monitor and analyze usage trends to improve our services and ensure security.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Disclosure of Your Information</h2>
        <p className="mb-3">
          We will not sell, trade, or rent your personal data to third parties. However, we may share your information with:
        </p>
        <ul className="list-disc list-inside mb-3">
          <li>
            <strong>Service Providers:</strong> Trusted third parties who assist in operating our platform and conducting business activities, under strict confidentiality agreements.
          </li>
          <li>
            <strong>Legal Requirements:</strong> When required by law, regulation, or legal process.
          </li>
          <li>
            <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. However, please be aware that no method of transmission or storage is 100% secure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">6. Data Retention</h2>
        <p>
          We will retain your personal data only for as long as is necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">7. Your Rights and Choices</h2>
        <p className="mb-3">
          You have the right to access, update, or delete your personal information. If you wish to exercise these rights, please contact us using the details provided below. You may also choose to opt-out of certain communications by following the unsubscribe instructions in our emails.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">8. Third-Party Links</h2>
        <p>
          Our platform may include links to external websites. We are not responsible for the privacy practices or the content of these third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">9. Children’s Privacy</h2>
        <p>
          MyanLang is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such data, please contact us immediately.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">10. Changes to This Privacy Policy</h2>
        <p className="mb-3">
          We may update our Privacy Policy from time to time. Any changes will be posted on this page along with an updated effective date. Your continued use of the platform after changes constitutes your acceptance of the updated policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">11. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
        </p>
        <p className="font-medium mt-2">Email: support@myanlang.com</p>
      </section>

      <footer className="text-center text-sm text-gray-500 border-t pt-4 mt-6">
        © {new Date().getFullYear()} MyanLang. All rights reserved.
      </footer>
    </div>
    </Box>
  );
};

export default PrivacyPolicy;
