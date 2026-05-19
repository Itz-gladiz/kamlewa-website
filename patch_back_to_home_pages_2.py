from pathlib import Path

patches = [
    {
        'path': Path('src/app/[locale]/about/page.tsx'),
        'old': "import PageBanner from '@/components/PageBanner';\nimport { useTranslations } from 'next-intl';\n",
        'new': "import PageBanner from '@/components/PageBanner';\nimport BackToHome from '@/components/BackToHome';\nimport { useTranslations } from 'next-intl';\n"
    },
    {
        'path': Path('src/app/[locale]/about/page.tsx'),
        'old': "  return (\n    <main className=\"relative\">\n      <Navbar />\n      <PageBanner\n",
        'new': "  return (\n    <main className=\"relative\">\n      <Navbar />\n      <BackToHome />\n      <PageBanner\n"
    },
    {
        'path': Path('src/app/[locale]/events-impact/page.tsx'),
        'old': "import PageBanner from '@/components/PageBanner';\nimport Pagination from '@/components/Pagination';\nimport { useTranslations } from 'next-intl';\n",
        'new': "import PageBanner from '@/components/PageBanner';\nimport Pagination from '@/components/Pagination';\nimport BackToHome from '@/components/BackToHome';\nimport { useTranslations } from 'next-intl';\n"
    },
    {
        'path': Path('src/app/[locale]/events-impact/page.tsx'),
        'old': "  return (\n    <main className=\"relative\">\n      <Navbar />\n\n      <PageBanner\n",
        'new': "  return (\n    <main className=\"relative\">\n      <Navbar />\n      <BackToHome />\n\n      <PageBanner\n"
    },
    {
        'path': Path('src/app/[locale]/contact/page.tsx'),
        'old': "import PageBanner from '@/components/PageBanner';\nimport { useTranslations } from 'next-intl';\nimport toast from 'react-hot-toast';\n",
        'new': "import PageBanner from '@/components/PageBanner';\nimport BackToHome from '@/components/BackToHome';\nimport { useTranslations } from 'next-intl';\nimport toast from 'react-hot-toast';\n"
    },
    {
        'path': Path('src/app/[locale]/contact/page.tsx'),
        'old': "  return (\n    <main className=\"relative\">\n      <Navbar />\n      <PageBanner\n",
        'new': "  return (\n    <main className=\"relative\">\n      <Navbar />\n      <BackToHome />\n      <PageBanner\n"
    }
]

for patch in patches:
    path = patch['path']
    text = path.read_text(encoding='utf-8')
    if patch['old'] not in text:
        raise SystemExit(f"Pattern not found in {path}: {patch['old'][:80]}...")
    path.write_text(text.replace(patch['old'], patch['new'], 1), encoding='utf-8')
print('patched pages')
