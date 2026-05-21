import { BottomNav } from "@/components/navigation/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-lg min-w-0 overflow-x-clip">
      <main className="main-content min-w-0 overflow-x-clip px-4 pt-4 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
