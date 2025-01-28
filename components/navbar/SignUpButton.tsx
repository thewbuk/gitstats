'use client';
import React from 'react';
import { SignedOut, useClerk } from '@clerk/nextjs';
import { Button } from '../ui/button';

const SignUpButton = () => {
  const { openSignUp } = useClerk();

  return (
    <SignedOut>
      <Button
        onClick={() => openSignUp()}
      >
        Sign up
      </Button>
    </SignedOut>
  );
};

export default SignUpButton;
