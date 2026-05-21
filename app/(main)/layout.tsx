import { BottomNav } from "@/components/navigation/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen max-w-lg overflow-x-hidden">
      <main className="main-content overflow-x-hidden px-4 pt-4 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
