import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function SettingsBanner() {
  return (
    <Alert
      variant="default"
      className="mb-6 border-black bg-white text-black dark:bg-black dark:text-white items-center flex space-x-4"
    >
      <AlertCircle className="h-6 w-6" />
      <div>
        <AlertTitle>Work in Progress</AlertTitle>
        <AlertDescription>
          This settings page is currently under development. Some features may
          not be fully functional.
        </AlertDescription>
      </div>
    </Alert>
  );
}
