import React from 'react';

const TermsAndConditionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #eee' }}>
          <h5 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#333' }}>Terms & Conditions</h5>
          <button onClick={onClose} style={{ border: '1px solid #eee', background: 'transparent', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13M1 1l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div style={{ padding: '24px', color: '#555', fontSize: '15px', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '15px', fontWeight: '500' }}>Welcome to HARENE. By accessing and using our website, you agree to the following terms:</p>
          <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li style={{ listStyleType: 'decimal' }}>
              <strong style={{ color: '#222' }}>Ownership</strong> &ndash; All content, product descriptions, designs, and images on this website are the property of HARENE and may not be copied, reproduced, or distributed without prior permission.
            </li>
            <li style={{ listStyleType: 'decimal' }}>
              <strong style={{ color: '#222' }}>Pricing & Availability</strong> &ndash; Product prices, descriptions, and availability are subject to change without notice.
            </li>
            <li style={{ listStyleType: 'decimal' }}>
              <strong style={{ color: '#222' }}>Orders</strong> &ndash; HARENE reserves the right to refuse, cancel, or limit any order at our discretion.
            </li>
            <li style={{ listStyleType: 'decimal' }}>
              <strong style={{ color: '#222' }}>Accuracy</strong> &ndash; Customers are responsible for ensuring all order details (size, specifications, personalization, etc.) are correct before purchase.
            </li>
            <li style={{ listStyleType: 'decimal' }}>
              <strong style={{ color: '#222' }}>Liability</strong> &ndash; HARENE is not liable for any indirect or consequential losses related to the use of our website or products.
            </li>
          </ul>
          <p style={{ marginTop: '20px', fontWeight: '500' }}>
            By purchasing from HARENE, you acknowledge and accept these terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
