import React from 'react';

const RefundReturnPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #eee' }}>
          <h5 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#333' }}>Refund & Return Policy</h5>
          <button onClick={onClose} style={{ border: '1px solid #eee', background: 'transparent', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13M1 1l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div style={{ padding: '24px', color: '#555', fontSize: '15px', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '15px', fontWeight: '500' }}>Your satisfaction is important to us.</p>
          <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li style={{ listStyleType: 'decimal' }}>
              <strong style={{ color: '#222' }}>Eligibility</strong> &ndash; Returns and exchanges are accepted within 7 days of delivery, provided items are unused, unworn, and returned in their original packaging with certificates.
            </li>
            <li style={{ listStyleType: 'decimal' }}>
              <strong style={{ color: '#222' }}>Exclusions</strong> &ndash; Customized, engraved, or personalized jewellery cannot be returned or refunded.
            </li>
            <li style={{ listStyleType: 'decimal' }}>
              <strong style={{ color: '#222' }}>Refunds</strong> &ndash; Approved refunds will be credited to the original payment method within 7&ndash;10 business days after inspection.
            </li>
            <li style={{ listStyleType: 'decimal' }}>
              <strong style={{ color: '#222' }}>Shipping Costs</strong> &ndash; Customers are responsible for return shipping charges, except when the product is defective or an incorrect item was delivered.
            </li>
            <li style={{ listStyleType: 'decimal' }}>
              <strong style={{ color: '#222' }}>Process</strong> &ndash; To initiate a return, please contact us at <a href="tel:+852-69731885" style={{ color: '#0066cc' }}>+852-69731885</a> or <a href="mailto:vipul@vndiamonds.com" style={{ color: '#0066cc' }}>vipul@vndiamonds.com</a>.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RefundReturnPolicyModal;
