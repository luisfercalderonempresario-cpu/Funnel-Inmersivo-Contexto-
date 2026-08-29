import React from 'react';
import { FunnelProvider } from './engine/state/FunnelContext';
import { AppShell } from './app/AppShell';

export default function App() {
  return (
    <FunnelProvider>
      <AppShell />
    </FunnelProvider>
  );
}
