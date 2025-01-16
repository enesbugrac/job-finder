"use client";

import { useTranslation } from "react-i18next";
import { useCallback, useState, useRef } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { setCookie } from "cookies-next";
import { useRouter, usePathname } from "next/navigation";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  {
    code: "tr",
    name: "Türkçe",
    flag: "/flags/tr.svg",
  },
  {
    code: "en",
    name: "English",
    flag: "/flags/en.svg",
  },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const pathLang = pathname.split("/")[1];
    return languages.find((lang) => lang.code === pathLang) || languages[0];
  });

  const handleLanguageChange = useCallback(
    async (code: string) => {
      const newPathname = pathname.replace(`/${selectedLanguage.code}`, `/${code}`);
      const newLang = languages.find((lang) => lang.code === code) || languages[0];

      setSelectedLanguage(newLang);
      i18n.changeLanguage(code);

      // Cookie'yi ayarla ve sayfayı yönlendir
      await setCookie("NEXT_LOCALE", code);
      router.replace(newPathname);
    },
    [selectedLanguage.code, pathname, router, i18n]
  );

  return (
    <div className="relative z-30" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[140px] px-2.5 py-1.5 text-sm border rounded-md hover:bg-background-secondary flex items-center gap-1.5 transition-colors"
      >
        <Image
          src={selectedLanguage.flag}
          alt={selectedLanguage.name}
          width={20}
          height={15}
          className="rounded-sm"
        />
        <span className="font-medium">{selectedLanguage.name}</span>
        <ChevronDownIcon
          className={`w-3.5 h-3.5 ml-auto ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-md shadow-lg w-[140px]">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-background-secondary ${
                language.code === selectedLanguage.code
                  ? "bg-background-secondary font-medium"
                  : ""
              }`}
            >
              <Image
                src={language.flag}
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
