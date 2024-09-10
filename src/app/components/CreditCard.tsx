"use client";
import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";

interface CreditCardProps {
  title: string;
  description: string;
  author: string;
  link: string;
  index: number;
}

const CreditCard: React.FC<CreditCardProps> = ({ title, description, author, link, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false); // Track if animation has occurred
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimated) {
              setIsVisible(true);
              setHasAnimated(true); // Set animated flag
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <div
      ref={cardRef}
      className={clsx(
        "flex flex-col p-8 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-700 dark:to-purple-700 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl font-stix",
        isVisible && 'animate-slide-in-right'
      )}
    >
      <h2 className="text-2xl font-semibold mb-2 text-white">{title}</h2>
      <p className="text-lg mb-4 text-white">{description}</p>
      <p className="mb-2 text-white">
        <strong>Author:</strong> {author}
      </p>
      <p className="mb-2 text-white">
        <strong>Link:</strong> <a href={link}></a>Click here
      </p>
    </div>
  );
};

export default CreditCard;
