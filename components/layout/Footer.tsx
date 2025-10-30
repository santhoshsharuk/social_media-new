import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 dark:bg-gray-900 text-center py-4 border-t dark:border-gray-700 hidden md:block">
      <p className="text-sm text-gray-700 dark:text-gray-400 font-semibold">
        Made with ❤️ in India 🇮🇳
      </p>
       <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
        © {new Date().getFullYear()} Productive Bharat. All rights reserved.
      </p>
    </footer>
  );
};