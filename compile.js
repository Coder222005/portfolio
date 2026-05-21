const fs = require('fs');
const path = require('path');

const BLOGS_DIR = path.join(__dirname, 'blogs');
const OUTPUT_FILE = path.join(__dirname, 'blogs.json');

function compileBlogs() {
  console.log('Compiling static blogs...');

  if (!fs.existsSync(BLOGS_DIR)) {
    console.error(`Error: Directory "${BLOGS_DIR}" does not exist.`);
    process.exit(1);
  }

  const files = fs.readdirSync(BLOGS_DIR);
  const posts = [];

  for (const file of files) {
    if (!file.endsWith('.json')) {
      continue;
    }

    const filePath = path.join(BLOGS_DIR, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const post = JSON.parse(content);

      // Validate required fields
      if (!post.title || !post.content) {
        console.warn(`Warning: Skipped ${file} - Missing title or content.`);
        continue;
      }

      // Default ID to filename without extension if not provided
      if (!post.id) {
        post.id = path.parse(file).name;
      }

      posts.push(post);
      console.log(`- Loaded: ${post.title} (${file})`);
    } catch (err) {
      console.error(`Error parsing file ${file}:`, err.message);
    }
  }

  // Sort posts chronologically by date (earlier dates first)
  // Non-dated posts will be placed at the beginning
  posts.sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date(0);
    const dateB = b.date ? new Date(b.date) : new Date(0);
    return dateA - dateB;
  });

  try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2), 'utf8');
    console.log(`\nSuccess! Compiled ${posts.length} blog posts into "${OUTPUT_FILE}".`);
  } catch (err) {
    console.error('Error writing output file:', err.message);
    process.exit(1);
  }
}

compileBlogs();
