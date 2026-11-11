const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const articlesDirectory = path.join(process.cwd(), 'src', 'content', 'articles');
const outputFile = path.join(process.cwd(), 'src', 'lib', 'articles-data.json');
const publicOutputFile = path.join(process.cwd(), 'public', 'data', 'articles.json');

console.log('Generating pre-bundled articles dataset from:', articlesDirectory);

if (!fs.existsSync(articlesDirectory)) {
  console.error('Articles directory not found:', articlesDirectory);
  process.exit(1);
}

const fileNames = fs.readdirSync(articlesDirectory);
const allArticles = [];

for (const fileName of fileNames) {
  if (!fileName.endsWith('.md')) continue;

  const fullPath = path.join(articlesDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const slug = data.slug || fileName.replace(/\.md$/, '');

  allArticles.push({
    slug,
    title: data.title || 'Untitled Article',
    description: data.description || '',
    publishedAt: data.publishedAt || new Date().toISOString(),
    updatedAt: data.updatedAt || data.publishedAt || new Date().toISOString(),
    category: data.category || 'Web Architecture',
    tags: data.tags || [data.category || 'Web Architecture'],
    featuredImage: data.featuredImage || '/images/placeholder.svg',
    readingTime: data.readingTime || '5 min read',
    wordCount: data.wordCount || 800,
    faqs: data.faqs || [],
    content,
  });
}

// Sort by publication date descending
allArticles.sort((a, b) => {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
});

console.log(`Successfully parsed ${allArticles.length} articles.`);

// Write full articles dataset for server/edge runtime
fs.writeFileSync(outputFile, JSON.stringify(allArticles, null, 2), 'utf8');
console.log(`Saved pre-bundled dataset to: ${outputFile}`);

// Write lightweight metadata dataset for public search
const publicDir = path.dirname(publicOutputFile);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const metadataList = allArticles.map(a => ({
  slug: a.slug,
  title: a.title,
  description: a.description,
  publishedAt: a.publishedAt,
  updatedAt: a.updatedAt,
  category: a.category,
  tags: a.tags,
  featuredImage: a.featuredImage,
  readingTime: a.readingTime,
  wordCount: a.wordCount,
  faqs: a.faqs,
}));

fs.writeFileSync(publicOutputFile, JSON.stringify(metadataList, null, 2), 'utf8');
console.log(`Saved search metadata to: ${publicOutputFile}`);
