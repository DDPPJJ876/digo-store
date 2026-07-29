import { AdminProductManager } from "@/components/AdminProductManager";
import { AdminInventoryPanel } from "@/components/AdminInventoryPanel";

export default function AdminPage() {
  return (
    <main className="shell admin-shell">
      <AdminProductManager />
      <AdminInventoryPanel />
    </main>
  );
}
