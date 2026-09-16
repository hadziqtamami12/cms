import React from 'react';
import VisualPageBuilder from './VisualPageBuilder';

export default function PageBuilder({ page, onBack, onSaved }) {
  return (
    <VisualPageBuilder
      page={page}
      onBack={onBack}
      onSaved={onSaved}
    />
  );
}
