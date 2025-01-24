'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface WelcomeSectionProps {
  userName?: string | null;
}

export const WelcomeSection = ({ userName }: WelcomeSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Badge variant="secondary" className="mb-4">
        Dashboard
      </Badge>
      <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}!</h1>
      <p className="text-muted-foreground">
        Manage your activities and connect with others
      </p>
    </motion.div>
  );
};
