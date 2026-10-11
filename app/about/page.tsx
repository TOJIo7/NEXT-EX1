'use client'


import { setLanguageAction } from "@/actions/langActions";
import { useTranslations } from "next-intl";
import Link from "next/link";


export default function Page() {
  const t = useTranslations('About');

  const handleLangChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    await setLanguageAction(newLang);
  };

  return (
    <>
      <Link href='/' className="text-4xl font-bold">HOME</Link>
      <div className="p-5 flex flex-col gap-4">
        <select
          onChange={handleLangChange}
          className="border p-2 rounded w-32 bg-white text-black"
        >
          <option value="en">English</option>
          <option value="ru">Русский</option>
        </select>

        <div>
          <h1>{t('MyName')}</h1>
          <h1>{t('WhoMe')}</h1>
        </div>
      </div>
    </>
  );
}