import AccountSidebar from '@/components/layout/AccountSidebar';
import { Separator } from '@/components/ui/separator';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">My Account</h1>
        <p className="text-muted-foreground">Manage your profile, orders, and preferences.</p>
      </div>
      <Separator className="mb-8"/>
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <AccountSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
