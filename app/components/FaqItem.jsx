import { useState } from "react";

export default function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-2">
      <button
        onClick={toggleOpen}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="font-medium">{question}</span>
        <span className="text-xl">{isOpen ? "-" : "+"}</span>
      </button>

      {isOpen && (
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {answer}
        </p>
      )}
    </div>
  );
}
