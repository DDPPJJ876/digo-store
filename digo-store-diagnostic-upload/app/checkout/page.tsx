export default function CheckoutPage() {
  const methods = [
    {
      name: "Card",
      detail: "Visa · Mastercard · American Express",
      icon: "💳",
      logos: "VISA  •  Mastercard  •  AMEX",
    },
    {
      name: "Apple Pay",
      detail: "Fast and secure checkout",
      icon: "",
      logos: "Apple Pay",
    },
    {
      name: "Alipay",
      detail: "支付宝",
      icon: "🇨🇳",
      logos: "Alipay",
    },
    {
      name: "WeChat Pay",
      detail: "微信支付",
      icon: "💚",
      logos: "WeChat Pay",
    },
    {
      name: "Bank Transfer",
      detail: "ACH · Bank of America · HSBC",
      icon: "🏦",
      logos: "ACH Bank Transfer",
    },
  ];

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-black">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">DIGO Checkout</h1>
        <p className="mt-3 text-gray-500">
          Secure payment experience designed for global customers.
        </p>

        <section className="mt-8 rounded-3xl border border-gray-200 p-6">
          <h2 className="text-lg font-medium">Order Summary</h2>
          <div className="mt-4 flex justify-between text-gray-600">
            <span>Lace Bandeau</span>
            <span>$129</span>
          </div>
          <div className="mt-3 flex justify-between font-medium">
            <span>Total</span>
            <span>$129</span>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-medium">Payment Methods</h2>
          <div className="mt-4 space-y-4">
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
                    <div className="mt-1 text-xs text-gray-400">{method.logos}</div>
                  </div>
                </div>
                <span>›</span>
              </button>
            ))}
          </div>
        </section>

        <button className="mt-8 w-full rounded-full bg-black px-6 py-4 text-white">
          Continue Payment
        </button>

        <div className="mt-8 rounded-2xl bg-gray-50 p-5 text-sm text-gray-600">
          Secure payments powered by Stripe.
        </div>
      </div>
    </main>
  );
}
