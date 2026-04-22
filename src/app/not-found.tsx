import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import NotFoundClient from './[locale]/not-found-client';

export default async function NotFound() {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <NotFoundClient />
    </NextIntlClientProvider>
  );
}
