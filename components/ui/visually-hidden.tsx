'use client';

import * as React from 'react';

type VisuallyHiddenProps = {
  children: React.ReactNode;
};

function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return (
    <span
      className="absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0"
      style={{ clip: 'rect(0, 0, 0, 0)' }}
    >
      {children}
    </span>
  );
}

export default VisuallyHidden;
