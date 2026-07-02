import React from 'react';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #eee' }}>
          <h5 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#333' }}>Privacy Policy</h5>
          <button onClick={onClose} style={{ border: '1px solid #eee', background: 'transparent', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13M1 1l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div style={{ padding: '24px', color: '#555', fontSize: '15px', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '15px', fontWeight: '500' }}>At HARENE, we value your trust and are committed to protecting your personal information.</p>
          <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li style={{ listStyleType: 'disc' }}>
              <strong style={{ color: '#222' }}>Information Collected</strong> &ndash; We may collect your name, email, phone number, and payment details to process orders and provide services.
            </li>
            <li style={{ listStyleType: 'disc' }}>
              <strong style={{ color: '#222' }}>Use of Information</strong> &ndash; Your data is used strictly for order fulfillment, customer support, and service improvements.
            </li>
            <li style={{ listStyleType: 'disc' }}>
              <strong style={{ color: '#222' }}>Confidentiality</strong> &ndash; We never sell, trade, or share your personal information with third parties, except as required by law.
            </li>
            <li style={{ listStyleType: 'disc' }}>
              <strong style={{ color: '#222' }}>Security</strong> &ndash; We implement industry-standard measures to keep your data safe and secure.
            </li>
            <li style={{ listStyleType: 'disc' }}>
              <strong style={{ color: '#222' }}>Consent</strong> &ndash; By using our website, you consent to the collection and use of your information in line with this policy.
            </li>
          </ul>
          <p style={{ marginTop: '20px' }}>
            For any privacy-related queries, contact us at <a href="mailto:vipul@vndiamonds.com" style={{ color: '#0066cc' }}>vipul@vndiamonds.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
