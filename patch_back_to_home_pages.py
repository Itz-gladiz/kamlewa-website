from pathlib import Path

replacements = [
    {
        'path': Path('src/components/BackToHome.tsx'),
        'old': "import { HiArrowLeft } from 'react-icons/hi';\nimport { Link, usePathname } from '@/i18n/routing';\nimport Button from '@/components/Button';\n\nexport default function BackToHome() {",
        'new': "import { HiArrowLeft } from 'react-icons/hi';\nimport { Link, usePathname } from '@/i18n/routing';\nimport Button from '@/components/Button';\n\nexport default function BackToHome() {"
    },
    {
        'path': Path('src/app/[locale]/layout.tsx'),
        'old': "import Toaster from '@/components/Toaster';\nimport BackToHome from '@/components/BackToHome';\n",
        'new': "import Toaster from '@/components/Toaster';\n"
    },
    {
        'path': Path('src/app/[locale]/layout.tsx'),
        'old': "  return (\n    <NextIntlClientProvider messages={messages}>\n      <BackToHome locale={locale} />\n      {children}\n      <Toaster />\n    </NextIntlClientProvider>\n  );\n}",
        'new': "  return (\n    <NextIntlClientProvider messages={messages}>\n      {children}\n      <Toaster />\n    </NextIntlClientProvider>\n  );\n}"
    },
    {
        'path': Path('src/app/[locale]/about/page.tsx'),
        'old': "import PageBanner from '@/components/PageBanner';\nimport { useTranslations } from 'next-intl';\n",
        'new': "import PageBanner from '@/components/PageBanner';\nimport BackToHome from '@/components/BackToHome';\nimport { useTranslations } from 'next-intl';\n"
    },
    {
        'path': Path('src/app/[locale]/about/page.tsx'),
        'old': "  return (\n    <main className=\"relative\">\n      <Navbar />\n\n      <PageBanner\n",
        'new': "  return (\n    <main className=\"relative\">\n      <Navbar />\n      <BackToHome />\n\n      <PageBanner\n"
    },
    {
        'path': Path('src/app/[locale]/community/page.tsx'),
        'old': "  return (\n    <main className=\"relative\">\n      <Navbar />\n\n      <PageBanner\n",
        'new': "  return (\n    <main className=\"relative\">\n      <Navbar />\n      <BackToHome />\n\n      <PageBanner\n"
    },
    {
        'path': Path('src/app/[locale]/events-impact/page.tsx'),
        'old': "import PageBanner from '@/components/PageBanner';\nimport Pagination from '@/components/Pagination';\n",
        'new': "import PageBanner from '@/components/PageBanner';\nimport Pagination from '@/components/Pagination';\nimport BackToHome from '@/components/BackToHome';\n"
    },
    {
        'path': Path('src/app/[locale]/events-impact/page.tsx'),
        'old': "  return (\n    <main className=\"relative\">\n      <Navbar />\n\n      <PageBanner\n",
        'new': "  return (\n    <main className=\"relative\">\n      <Navbar />\n      <BackToHome />\n\n      <PageBanner\n"
    },
    {
        'path': Path('src/app/[locale]/contact/page.tsx'),
        'old': "import PageBanner from '@/components/PageBanner';\nimport { useTranslations } from 'next-intl';\n",
        'new': "import PageBanner from '@/components/PageBanner';\nimport BackToHome from '@/components/BackToHome';\nimport { useTranslations } from 'next-intl';\n"
    },
    {
        'path': Path('src/app/[locale]/contact/page.tsx'),
        'old': "  return (\n    <main className=\"relative\">\n      <Navbar />\n      <PageBanner\n",
        'new': "  return (\n    <main className=\"relative\">\n      <Navbar />\n      <BackToHome />\n      <PageBanner\n"
    }
]

for rep in replacements:
    path = rep['path']
    text = path.read_text(encoding='utf-8')
    if rep['old'] not in text:
        raise SystemExit(f"Pattern not found in {path}: {rep['old'][:80]}...")
    path.write_text(text.replace(rep['old'], rep['new'], 1), encoding='utf-8')
print('patched')
