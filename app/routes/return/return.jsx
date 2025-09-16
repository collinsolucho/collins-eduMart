import { AtSign, Phone } from "lucide-react";

export default function ReturnPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 text-gray-800 px-4 py-8 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
          📦 Return & Refund Policy
        </h1>

        <p className="mb-6 text-sm sm:text-base leading-relaxed text-gray-700 text-center">
          At <strong>Collins EduMart</strong>, we value our customers and want
          you to be fully satisfied with your purchase. If you are not
          completely happy with your order, our return policy ensures a smooth
          process for exchanges, returns, and refunds.
        </p>

        <ol className="list-decimal pl-4 sm:pl-6 space-y-6 text-sm sm:text-base">
          <li>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Eligibility for Returns
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>
                Items must be returned within <strong>7 days</strong> of
                delivery.
              </li>
              <li>
                Items must be unused, in original packaging, and in the same
                condition.
              </li>
              <li>
                Proof of purchase (order number, receipt, or confirmation email)
                is required.
              </li>
            </ul>
          </li>

          <li>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Non-Returnable Items
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>
                Digital products (eBooks, software, downloadable content).
              </li>
              <li>Gift cards or vouchers.</li>
              <li>
                Items damaged due to misuse, mishandling, or wear and tear after
                delivery.
              </li>
            </ul>
          </li>

          <li>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Exchange & Refund Options
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>
                <strong>Exchanges</strong>: Defective or incorrect items will be
                replaced at no extra cost.
              </li>
              <li>
                <strong>Refunds</strong>: Processed within 5–10 business days
                after inspection, via your original payment method.
              </li>
              <li>
                <strong>Store Credit</strong>: Option to request credit for
                future purchases.
              </li>
            </ul>
          </li>

          <li>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Return Process
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>
                Contact our support team via email or WhatsApp within 7 days of
                receiving your order.
              </li>
              <li>Provide your order details and reason for return.</li>
              <li>Our team will guide you on how to send the product back.</li>
              <li>
                After inspection, we will process your exchange, refund, or
                store credit.
              </li>
            </ul>
          </li>

          <li>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Shipping Costs
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>
                If it’s our error (wrong/defective item), we cover shipping.
              </li>
              <li>
                If it’s a preference change (wrong size, changed mind), customer
                covers shipping.
              </li>
            </ul>
          </li>

          <li>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Contact Us
            </h2>
            <p className="text-gray-700">
              For returns or questions, reach us at: <br />
              <AtSign />
              <a
                href="mailto:support@collinsedumart.co.ke"
                className="text-blue-600 hover:underline"
              >
                support@collinsedumart.co.ke
              </a>
              <br />
              <Phone /> +254 743709582 (WhatsApp available)
            </p>
          </li>
        </ol>
      </div>
    </main>
  );
}
