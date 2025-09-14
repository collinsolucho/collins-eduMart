import FaqItem from "./FaqItem";

export default function FAQ() {
  let data = [
    {
      question: "How long does delivery take?",
      answer:
        "Standard shipping takes 3-5 business days. Express options (1-2 days) are available at checkout.",
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes! You’ll receive a tracking link via email/SMS once your order ships.",
    },
    {
      question: "Do you ship countrywide?",
      answer:
        "Currently, we deliver within Kenya. Follow our social media pages for regional updates!",
    },
    {
      question: "Are gadgets covered by warranty?",
      answer: "Yes! All electronics come with a 1-year manufacturer warranty.",
    },
    {
      question: "Do you offer bulk discounts for schools?",
      answer:
        "Yes, email schools@collinsedumart.com for school orders and bulk pricing.",
    },
  ];

  return (
    <section className="space-y-4 pt-6">
      <h2 className="text-xl font-semibold">📚 Collins Edumart FAQs</h2>

      {data.map((item, index) => (
        <FaqItem key={index} question={item.question} answer={item.answer} />
      ))}
    </section>
  );
}
