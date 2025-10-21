import * as dotenv from "dotenv";
import { db } from "../server/db/index";
import { posts, categories, postCategories } from "../server/db/schema";

// Load environment variables
dotenv.config();

const sampleCategories = [
  { name: "Web Development", description: "Modern web technologies and frameworks" },
  { name: "JavaScript", description: "JavaScript programming language" },
  { name: "React", description: "React library and ecosystem" },
  { name: "TypeScript", description: "TypeScript language and tools" },
  { name: "API Design", description: "RESTful and GraphQL API development" },
  { name: "Backend", description: "Server-side development" },
  { name: "CSS", description: "Styling and design" },
  { name: "Frontend", description: "Client-side development" },
  { name: "DevOps", description: "Deployment and infrastructure" },
  { name: "Career", description: "Professional development" },
];

const samplePosts = [
  {
    title: "Building Scalable React Applications: A Complete Guide",
    content: `React has become the de facto library for building modern web applications. But as your application grows, you'll face challenges around state management, code organization, and performance optimization.

## The Foundation: Project Structure

A well-organized project structure is crucial for maintainability. Here's the structure I recommend for large-scale React apps:

\`\`\`
src/
├── components/     # Reusable UI components
├── features/       # Feature-based modules
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── services/       # API and external services
└── types/          # TypeScript type definitions
\`\`\`

## State Management at Scale

When your app grows beyond a few components, you'll need a robust state management solution. Here are the main options:

**1. Context API + useReducer** - Perfect for small to medium apps with straightforward state needs.

**2. Zustand** - My personal favorite for most applications. It's lightweight, has minimal boilerplate, and works great with TypeScript.

**3. Redux Toolkit** - Still the best choice for extremely complex state logic with time-travel debugging needs.

## Performance Optimization

Performance optimization should be part of your development process, not an afterthought. Here are key strategies:

### Code Splitting
Use React.lazy() and Suspense to split your code into smaller chunks:

\`\`\`jsx
const Dashboard = lazy(() => import('./features/Dashboard'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  )
}
\`\`\`

### Memoization
Use React.memo, useMemo, and useCallback strategically to prevent unnecessary re-renders.

## Testing Strategy

A comprehensive testing strategy is essential:

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test how components work together
- **E2E Tests**: Test critical user flows

## Conclusion

Building scalable React applications requires thoughtful architecture, performance optimization, and comprehensive testing. Start with these patterns and adjust based on your specific needs.`,
    excerpt: "Learn how to architect large-scale React applications with proper state management, code splitting, and performance optimization techniques that actually work in production.",
    authorName: "Sarah Chen",
    authorUsername: "sarahchen",
    authorBio: "Tech writer & software engineer specializing in React and TypeScript",
    authorFollowers: 12500,
    published: true,
    categories: ["React", "JavaScript", "Web Development"],
  },
  {
    title: "The Art of API Design: Principles for Building Intuitive Interfaces",
    content: `Great APIs are invisible - they just work. But getting there requires careful thought about design principles, developer experience, and long-term maintenance.

## Core Principles

### 1. Consistency is Key

Your API should follow consistent patterns. If you use \`/users/:id\` for one resource, don't switch to \`/posts/get/:id\` for another.

### 2. Use HTTP Methods Correctly

- **GET**: Retrieve data
- **POST**: Create new resources
- **PUT/PATCH**: Update existing resources
- **DELETE**: Remove resources

### 3. Meaningful Status Codes

Don't return 200 OK for everything. Use proper HTTP status codes:

- \`200\`: Success
- \`201\`: Created
- \`400\`: Bad Request
- \`401\`: Unauthorized
- \`404\`: Not Found
- \`500\`: Server Error

## RESTful Best Practices

### Resource Naming

Use nouns, not verbs:
-  \`GET /api/posts\`
-  \`GET /api/getPosts\`

### Filtering and Pagination

\`\`\`
GET /api/posts?status=published&limit=10&offset=20
\`\`\`

### Error Handling

Return consistent error structures:

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [...]
  }
}
\`\`\`

## GraphQL Considerations

GraphQL offers flexibility but adds complexity. Use it when:
- Clients need different data shapes
- You want to minimize over-fetching
- You have multiple client types

## Versioning Strategy

Always version your API:
- URL versioning: \`/api/v1/posts\`
- Header versioning: \`Accept: application/vnd.api.v1+json\`

## Documentation

Great APIs have great docs. Use tools like:
- OpenAPI/Swagger
- Postman Collections
- Interactive playgrounds

## Conclusion

API design is about empathy - understanding what developers need and making their lives easier. Follow these principles and iterate based on feedback.`,
    excerpt: "Explore the fundamental principles behind great API design. From RESTful conventions to GraphQL patterns, discover how to create APIs that developers love to use.",
    authorName: "Michael Ross",
    authorUsername: "mross",
    authorBio: "Backend architect with 10+ years building scalable APIs",
    authorFollowers: 8200,
    published: true,
    categories: ["API Design", "Backend", "Web Development"],
  },
  {
    title: "Modern CSS Techniques You Should Know in 2024",
    content: `CSS has evolved dramatically in recent years. Let's explore the modern features that are changing how we build responsive, maintainable stylesheets.

## Container Queries

The game-changer we've been waiting for:

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
\`\`\`

## CSS Nesting

Native nesting support is finally here:

\`\`\`css
.card {
  padding: 1rem;
  
  &:hover {
    background: var(--hover-bg);
  }
  
  .title {
    font-size: 1.5rem;
  }
}
\`\`\`

## Cascade Layers

Control specificity wars with layers:

\`\`\`css
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; padding: 0; }
}

@layer components {
  .button { /* styles */ }
}
\`\`\`

## Modern Layout: Grid & Flexbox

### CSS Grid for 2D Layouts

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
\`\`\`

### Flexbox for 1D Layouts

\`\`\`css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
\`\`\`

## Color Functions

Modern color manipulation:

\`\`\`css
:root {
  --primary: oklch(0.7 0.2 200);
  --primary-light: oklch(from var(--primary) calc(l + 0.1) c h);
}
\`\`\`

## Custom Properties (CSS Variables)

Dynamic theming made easy:

\`\`\`css
:root {
  --spacing-unit: 0.5rem;
  --color-primary: #0066cc;
}

[data-theme="dark"] {
  --color-primary: #66b3ff;
}
\`\`\`

## Logical Properties

Write direction-agnostic CSS:

\`\`\`css
.element {
  margin-inline: 1rem;  /* replaces margin-left/right */
  padding-block: 2rem;  /* replaces padding-top/bottom */
}
\`\`\`

## Has Selector

Parent selector finally in CSS:

\`\`\`css
form:has(:invalid) {
  border: 2px solid red;
}
\`\`\`

## Conclusion

Modern CSS is powerful, expressive, and maintainable. Start incorporating these features into your projects today!`,
    excerpt: "Container queries, CSS nesting, cascade layers, and more. Dive into the latest CSS features that are changing how we build responsive, maintainable stylesheets.",
    authorName: "Emma Wilson",
    authorUsername: "emmawrites",
    authorBio: "Frontend developer and CSS enthusiast",
    authorFollowers: 15100,
    published: true,
    categories: ["CSS", "Frontend", "Web Development"],
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Check for existing categories and create missing ones
    console.log("📁 Checking categories...");
    const existingCategories = await db.select().from(categories);
    const existingCategoryNames = new Set(existingCategories.map(cat => cat.name));
    
    const newCategories = sampleCategories.filter(cat => !existingCategoryNames.has(cat.name));
    
    let createdCategories = [...existingCategories];
    
    if (newCategories.length > 0) {
      console.log(`📁 Creating ${newCategories.length} new categories...`);
      const insertedCategories = await db
        .insert(categories)
        .values(newCategories.map(cat => ({
          name: cat.name,
          slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
          description: cat.description,
        })))
        .returning();
      
      createdCategories = [...createdCategories, ...insertedCategories];
      console.log(`✅ Created ${insertedCategories.length} new categories`);
    } else {
      console.log("✅ All categories already exist");
    }

    // Create a map of category names to IDs
    const categoryMap = new Map(
      createdCategories.map(cat => [cat.name, cat.id])
    );

    // Check for existing posts and create missing ones
    console.log("📝 Checking posts...");
    const existingPosts = await db.select().from(posts);
    const existingPostSlugs = new Set(existingPosts.map(post => post.slug));
    
    const newPosts = samplePosts.filter(postData => {
      const slug = postData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return !existingPostSlugs.has(slug);
    });
    
    if (newPosts.length > 0) {
      console.log(`📝 Creating ${newPosts.length} new posts...`);
      for (const postData of newPosts) {
        const categoryIds = postData.categories
          .map(name => categoryMap.get(name))
          .filter(Boolean) as string[];

        const [post] = await db
          .insert(posts)
          .values({
            title: postData.title,
            slug: postData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            content: postData.content,
            excerpt: postData.excerpt,
            authorName: postData.authorName,
            authorUsername: postData.authorUsername,
            authorBio: postData.authorBio,
            authorFollowers: postData.authorFollowers,
            readTime: calculateReadTime(postData.content),
            published: postData.published,
            publishedAt: postData.published ? new Date() : null,
            views: Math.floor(Math.random() * 10000),
            likes: Math.floor(Math.random() * 1000),
            commentsCount: Math.floor(Math.random() * 100),
          })
          .returning();

        // Link post to categories
        if (categoryIds.length > 0) {
          await db.insert(postCategories).values(
            categoryIds.map(categoryId => ({
              postId: post.id,
              categoryId,
            }))
          );
        }

        console.log(`✅ Created post: ${post.title}`);
      }
    } else {
      console.log("✅ All posts already exist");
    }

    console.log("✨ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Run seed
seed()
  .then(() => {
    console.log("👋 Exiting...");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });