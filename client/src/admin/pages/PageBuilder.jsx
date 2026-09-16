import React from 'react';
import AdminPageBuilder from '../AdminPageBuilder';

export default function PageBuilder({ page, onBack, onSaved }) {
  return (
    <AdminPageBuilder
      page={page}
      onBack={onBack}
      onSaved={onSaved}
    />
  );
}
