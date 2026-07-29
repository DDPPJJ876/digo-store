export default function CheckoutPage() {
  const methods = [
    {
      name: "Card",
      detail: "Visa · Mastercard · American Express",
      icon: "💳",
    },
    {
      name: "Apple Pay",
      detail: "Fast and secure checkout",
      icon: "",
    },
    {
      name: "Alipay",
      detail: "支付宝",
      icon: "🇨🇳",
    },
    {
      name: "WeChat Pay",
      detail: "微信支付",
      icon: "💚",
    },
    {
      name: "Bank Transfer",
      detail: "ACH · Bank of America · HSBC",
      icon: "🏦",
    },
  ];

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-black">
      <div className="mx-auto max-w-xl">
        <h1 className="text-4xl font-semibold tracking-tight">DIGO Checkout</h1>
        <p className="mt-3 text-gray-500">
          Choose your preferred secure payment method.
        </p>

        <section className="mt-10 space-y-4">
          {methods.map((method) => (
            <button
              key={method.name}
              className="flex w-full items-center justify-between rounded-2xl border border-gray-200 p-5 text-left transition hover:border-black"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <div className="font-medium">{method.name}</div>
                  <div className="text-sm text-gray-500">{method.detail}</div>
                </div>
              </div>
              <span>›</span>
            </button>
          ))}
        </section>

        <div className="mt-10 rounded-2xl bg-gray-50 p-5 text-sm text-gray-600">
          Secure payments powered by Stripe.
        </div>
      </div>
    </main>
  );
}
