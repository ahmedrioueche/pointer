"use client"
import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/home/Navbar";
import Footer from "@/app/components/Footer";
import CreditCard from "@/app/components/CreditCard";

const creditsData = [
  {
    id: 1,
    title: "Boys and girls avatars",
    description: "A collection of icons used throughout the app.",
    author: "Freepik from @flaticon",
    link: "https://www.flaticon.com/authors/freepik",
  },
  {
    id: 2,
    title: "Contact story set",
    description: "Communication illustrations by Storyset.",
    author: "Freepik @storyset",
    link: "https://storyset.com/communication",
  },
];

const Credits: React.FC = () => {

  return (
    <>
      <Navbar />
      <section
        id="credits"
        className={`md:py-16 px-6 py-8 min-h-screen dark:bg-dark-background dark:text-dark-text bg-light-background text-light-text`}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 font-satisfy text-center">
            Credits
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
            {creditsData.map((credit, index) => (
              <CreditCard
                key={credit.id}
                title={credit.title}
                description={credit.description}
                author={credit.author}
                link={credit.link}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Credits;
