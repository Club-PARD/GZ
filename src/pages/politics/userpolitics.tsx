// src/pages/profile/index.tsx
'use client';

import React, { useState } from 'react';
import PoliciesSection from '@/pages/profile/PoliciesSection';
import Header from '@/components/home-header';
import Footer from '@/components/Footer';

export default function ProfilePoliciesPage() {
  const { expanded, agreed, toggleExpand, toggleAgree } = usePolicies();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-white">
      <Header />

      <main className="flex-1 container mx-auto py-16 w-[900px] pt-[150px]">
        
        <PoliciesSection
          expanded={expanded}
          agreed={agreed}
          toggleExpand={toggleExpand}
          toggleAgree={toggleAgree}
        />
      </main>

      <Footer />
    </div>
  );
}

function usePolicies() {
  const [expanded, setExpanded] = useState<{ terms: boolean; privacy: boolean }>({
    terms: false,
    privacy: false,
  });
  const [agreed, setAgreed] = useState<{ terms: boolean; privacy: boolean }>({
    terms: false,
    privacy: false,
  });

  const toggleExpand = (key: 'terms' | 'privacy') =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleAgree = (key: 'terms' | 'privacy') =>
    setAgreed(prev => ({ ...prev, [key]: !prev[key] }));

  return { expanded, agreed, toggleExpand, toggleAgree };
}
