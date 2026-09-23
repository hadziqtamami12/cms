import React from 'react';
import SetupWizard from '../components/installer/SetupWizard';

export const SetupPage = ({ onComplete }) => {
  return <SetupWizard onComplete={onComplete} />;
};

export default SetupPage;
