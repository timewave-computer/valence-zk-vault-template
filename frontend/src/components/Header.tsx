"use client";
import React from "react";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  const onMainButtonClick = () => {
    alert("Not implemented");
  };
  return (
    <header>
      <div className="flex flex-wrap gap-4 justify-between items-center py-4 mb-4">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">V</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white ">Valence ZK Vaults</h1>
          </div>
        </div>

        {/* Main Button */}
        <div className="flex items-center">
          <button
            onClick={onMainButtonClick}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Wallet
          </button>
        </div>
      </div>
    </header>
  );
};
