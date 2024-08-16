'use client';

import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Loading: React.FC = () => {
    return (
        <section className={`py-16 flex items-center justify-center min-h-screen dark:bg-dark-background bg-light-background`}>
            <div className="container mx-auto flex flex-col items-center">
                <div className="relative md:w-1/2 flex flex-col items-center bg-white dark:bg-dark-background rounded-lg shadow-lg p-8 font-stix">
                    <div className="flex items-center justify-center mb-4">
                        <AiOutlineLoading3Quarters className="text-5xl text-blue-500 dark:text-blue-400 animate-spin" />
                    </div>
                    <h2 className={`text-2xl font-bold mb-4 bg-gradient-to-r from-dark-primary to-dark-accent text-transparent bg-clip-text`}>
                        Please Wait...
                    </h2>
                    <p className={`text-lg font-stix text-center dark:text-dark-text text-light-text`}>
                        We are processing your request. This may take a few moments.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Loading;
