'use client';

import * as React from 'react';
import {
  Bell,
  Check,
  Globe,
  Home,
  Keyboard,
  Link,
  Lock,
  Menu,
  MessageCircle,
  Paintbrush,
  Settings,
  Video,
} from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';

const data = {
  nav: [
    { name: 'Notifications', icon: Bell },
    { name: 'Navigation', icon: Menu },
    { name: 'Home', icon: Home },
    { name: 'Appearance', icon: Paintbrush },
    { name: 'Messages & media', icon: MessageCircle },
    { name: 'Language & region', icon: Globe },
    { name: 'Accessibility', icon: Keyboard },
    { name: 'Mark as read', icon: Check },
    { name: 'Audio & video', icon: Video },
    { name: 'Connected accounts', icon: Link },
    { name: 'Privacy & visibility', icon: Lock },
    { name: 'Advanced', icon: Settings },
  ],
};

export function SettingsContent() {
  const [activeTab, setActiveTab] = React.useState('Notifications');

  const renderContent = () => {
    switch (activeTab) {
      case 'Notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Notification Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure how you want to receive notifications.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <Switch id="push-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch id="email-notifications" />
              </div>
            </div>
          </div>
        );
      case 'Appearance':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Appearance Settings</h3>
              <p className="text-sm text-muted-foreground">
                Customize the look and feel of the application.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <div className="flex gap-2">
                  <Button variant="outline">Light</Button>
                  <Button variant="outline">Dark</Button>
                  <Button variant="outline">System</Button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Privacy & visibility':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Privacy Settings</h3>
              <p className="text-sm text-muted-foreground">
                Manage your privacy preferences.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="profile-visibility">Public Profile</Label>
                <Switch id="profile-visibility" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="activity-status">Show Activity Status</Label>
                <Switch id="activity-status" />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{activeTab}</h3>
              <p className="text-sm text-muted-foreground">
                This section is under development.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-background">
      <SidebarProvider>
        <div className="grid grid-cols-4 gap-6">
          <Sidebar collapsible="none" className="col-span-1">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.name === activeTab}
                          onClick={() => setActiveTab(item.name)}
                        >
                          <button className="w-full">
                            <item.icon />
                            <span>{item.name}</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="col-span-3">
            <header className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{activeTab}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="rounded-lg border p-6">{renderContent()}</div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
