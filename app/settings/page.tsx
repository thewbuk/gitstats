import { SettingsContent } from './components/SettingsContent';
import { SettingsBanner } from './components/SettingsBanner';

export default function Page() {
  return (
    <div className="container py-8">
      <SettingsBanner />
      <SettingsContent />
    </div>
  );
}
