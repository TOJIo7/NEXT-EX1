// app/actions.ts
'use server'

import { cookies } from 'next/headers';

export async function setLanguageAction(newLang: string) {
    const cookieStore = await cookies();
    cookieStore.set('lang', newLang)
}