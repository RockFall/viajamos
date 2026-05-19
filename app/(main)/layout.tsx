import { BottomNav } from "@/components/navigation/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen max-w-lg">
      <main className="main-content px-4 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
