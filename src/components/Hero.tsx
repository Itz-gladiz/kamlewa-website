import { useTranslations } from 'next-intl';
import HeroClient from './HeroClient';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <HeroClient
      headline={t('headline')}
      subtext={t('subtext')}
      volunteer={t('volunteer')}
      partner={t('partner')}
    />
  );
}
