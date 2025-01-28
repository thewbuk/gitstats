'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ClerkAuth from './(auth)/clerk/page';
import GitHubAuth from './(auth)/github/page';
import { ClerkProvider } from '@clerk/nextjs';
import { SiteHeader } from '@/components/navbar/SiteHeader';

export default function Home() {
  return (
    <div className="container mx-auto mt-10 p-4">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          GitStats Authentication
        </h1>
        <Tabs defaultValue="clerk" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="clerk">Clerk Auth</TabsTrigger>
            <TabsTrigger value="github">GitHub Token</TabsTrigger>
          </TabsList>
          <TabsContent value="clerk">
            <div className="mt-6">
              <ClerkProvider>
                <SiteHeader />
                <ClerkAuth routing="hash" />
              </ClerkProvider>
            </div>
          </TabsContent>
          <TabsContent value="github">
            <div className="mt-6">
              <GitHubAuth />
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
