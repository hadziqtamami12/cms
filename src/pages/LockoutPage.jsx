import React from 'react';
import SubscriptionHold from '../components/lockout/SubscriptionHold';

export const LockoutPage = ({ onRenewSuccess }) => {
  return <SubscriptionHold onRenewSuccess={onRenewSuccess} />;
};

export default LockoutPage;
