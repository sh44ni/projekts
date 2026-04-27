"use client";

import { ContactProvider } from "./ContactPopup";
import PageTracker from "./PageTracker";

export default function ContactProviderWrapper({ children }) {
  return (
    <ContactProvider>
      <PageTracker />
      {children}
    </ContactProvider>
  );
}
