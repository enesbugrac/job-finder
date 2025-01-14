"use client";

import { useTranslation } from "react-i18next";
import { useCallback, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "EN", flag: "en" },
  { code: "tr", name: "TR", flag: "tr" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = useCallback(
    (langCode: string) => {
      i18n.changeLanguage(langCode).catch(console.error);
      setIsOpen(false);
    },
    [i18n]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 text-sm border rounded-md hover:bg-background-secondary flex items-center gap-1.5 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Image
          src={`/flags/${currentLanguage.flag}.svg`}
          alt={currentLanguage.name}
          width={20}
          height={15}
          className="rounded-sm"
        />
        <span className="font-medium">{currentLanguage.name}</span>
        <ChevronDownIcon
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-md shadow-lg overflow-hidden min-w-[100px] max-h-[300px] overflow-y-auto">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-background-secondary transition-colors ${
                language.code === i18n.language
                  ? "bg-background-secondary font-medium"
                  : ""
              }`}
            >
              <Image
                src={`/flags/${language.flag}.svg`}
                alt={language.name}
                width={18}
                height={14}
                className="rounded-sm"
              />
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
