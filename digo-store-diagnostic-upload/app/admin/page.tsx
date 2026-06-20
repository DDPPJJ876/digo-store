import { AdminProductForm } from "@/components/AdminProductForm";

export default function AdminPage() {
  return (
    <main className="shell">
      <section className="hero">
        <div>
          <h1>Upload a product.</h1>
          <p>
            Add the photo, price, and description. The product appears on the
            storefront immediately after publishing.
          </p>
        </div>
      </section>

      <AdminProductForm />
    </main>
  );
}
