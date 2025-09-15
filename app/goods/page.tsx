'use client';

import { useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { goodsData } from "@/data/index";
import { CustomLink } from "@/components/Link";
import Image from "next/image";

type Category = "everything" | "lifestyle" | "workspace" | "photography" | "wishlist";

export default function Goods() {
  const [activeCategory, setActiveCategory] = useState<Category>("everything");

  const categories: { value: Category; label: string }[] = [
    { value: "everything", label: "everything" },
    { value: "lifestyle", label: "lifestyle" },
    { value: "workspace", label: "workspace" },
    { value: "photography", label: "photography" },
    { value: "wishlist", label: "wishlist" },
  ];

  const filteredGoods = activeCategory === "everything" 
    ? goodsData 
    : goodsData.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="container max-w-none">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <PageTitle>GOODS</PageTitle>
          <p className="text-gray-600 dark:text-gray-400">A collection of my favorite items.</p>
        </div>
        
        {/* Category Navigation with dots */}
        <div className="pb-8">
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {categories.map((category, index) => (
              <div key={category.value} className="flex items-center">
                <button
                  onClick={() => setActiveCategory(category.value)}
                  className={`hover:text-gray-900 dark:hover:text-gray-100 transition-colors ${
                    activeCategory === category.value
                      ? "text-gray-900 dark:text-gray-100 font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {category.label}
                </button>
                {index < categories.length - 1 && (
                  <span className="mx-2 text-gray-400">·</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Goods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-16">
          {filteredGoods.map((item) => (
            <CustomLink 
              href={item.href} 
              key={item.name} 
              className="group block"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="space-y-3">
                {/* Image Container */}
                <div className="relative aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                  {item.isNew && (
                    <div className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded-sm z-10 font-medium">
                      New
                    </div>
                  )}
                  {item.imgSrc ? (
                    <Image
                      src={item.imgSrc}
                      alt={item.name}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                    {item.brand}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 lowercase">
                    {item.category}
                  </p>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">
                    {item.name}
                  </h3>
                </div>
              </div>
            </CustomLink>
          ))}
        </div>
        
        {filteredGoods.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400">No items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}