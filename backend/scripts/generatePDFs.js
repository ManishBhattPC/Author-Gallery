import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '..', '..', 'task_guides');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createHeader(doc, title, subtitle, devRole) {
  // Brand header bar
  doc.rect(0, 0, 612, 85).fill('#3B2314'); // Parchment dark header color
  doc.fillColor('#FAF6F0').fontSize(22).font('Helvetica-Bold').text(title, 40, 20);
  doc.fillColor('#E5D3B3').fontSize(12).font('Helvetica').text(subtitle, 40, 48);
  doc.fillColor('#C9A87C').fontSize(10).font('Helvetica-Bold').text(`TARGET ROLE: ${devRole.toUpperCase()}`, 40, 66);
  
  doc.fillColor('#2C1810');
  doc.y = 105;
}

function addSectionTitle(doc, title) {
  doc.moveDown(0.8);
  doc.fillColor('#5C3A21').fontSize(14).font('Helvetica-Bold').text(title);
  doc.rect(40, doc.y + 2, 532, 2).fill('#D9C3B0');
  doc.moveDown(0.5);
  doc.fillColor('#2C1810').fontSize(10).font('Helvetica');
}

function addBullet(doc, boldLabel, text) {
  doc.font('Helvetica-Bold').text(`• ${boldLabel}: `, { continued: true });
  doc.font('Helvetica').text(text);
  doc.moveDown(0.3);
}

function addCodeBlock(doc, lines) {
  doc.moveDown(0.3);
  const startY = doc.y;
  const blockHeight = lines.length * 14 + 12;
  
  // Background box
  doc.rect(40, startY, 532, blockHeight).fill('#1E1E1E');
  doc.fillColor('#D4D4D4').font('Courier').fontSize(9);
  
  lines.forEach((line, index) => {
    doc.text(line, 50, startY + 8 + (index * 14));
  });
  
  doc.y = startY + blockHeight + 10;
  doc.fillColor('#2C1810').font('Helvetica').fontSize(10);
}

// -------------------------------------------------------------
// PDF 1: Developer 1 (Frontend Lead / You)
// -------------------------------------------------------------
function generateDev1PDF() {
  const doc = new PDFDocument({ margin: 40, size: 'LETTER' });
  const stream = fs.createWriteStream(path.join(outputDir, 'Developer_1_Frontend_Lead_Guide.pdf'));
  doc.pipe(stream);

  createHeader(doc, 'Author Gallery - Upgrade Week Plan', 'Developer 1 (Frontend Lead) Action Plan', 'Frontend Lead & Core UX');

  addSectionTitle(doc, '1. Scope of Work & Responsibilities');
  addBullet(doc, 'Primary Focus', 'Reader Interactive Experience, Universal Search (Ctrl+K), App Theme Switcher, Audio Text-to-Speech Player, Personal Bookshelves.');
  addBullet(doc, 'Git Feature Branch', 'feature/reader-experience');
  addBullet(doc, 'Target Workplaces', 'frontend/src/context, frontend/src/components, frontend/src/pages, frontend/src/styles');

  addSectionTitle(doc, '2. Git & Collaboration Commands');
  addCodeBlock(doc, [
    '# 1. Switch to main and pull latest code',
    'git checkout main && git pull origin main',
    '# 2. Create your dedicated feature branch',
    'git checkout -b feature/reader-experience',
    '# 3. Stage and commit your changes',
    'git add . && git commit -m "feat: added distraction-free reading mode modal"',
    '# 4. Push to remote repository',
    'git push origin feature/reader-experience'
  ]);

  addSectionTitle(doc, '3. Detailed File Implementation Checklist');
  
  addBullet(doc, '[NEW] frontend/src/context/ThemeContext.jsx', 'Global context provider for themes (parchment, dark, sepia, modernLight).');
  addBullet(doc, '[NEW] frontend/src/styles/themes.css', 'CSS color custom variables for all background, card, and font color modes.');
  addBullet(doc, '[NEW] frontend/src/components/ReaderComponents/ReadingModeModal.jsx', 'Full-screen reading modal with font size slider, line height, bookmarking, and dark/sepia toggle.');
  addBullet(doc, '[NEW] frontend/src/components/ReaderComponents/TTSPlayerBar.jsx', 'Audiobook player bar utilizing window.speechSynthesis for Play/Pause, speed (0.75x, 1x, 1.25x), and audio controls.');
  addBullet(doc, '[NEW] frontend/src/components/SearchComponents/CommandPalette.jsx', 'Universal Ctrl+K / Cmd+K instant keyboard search modal across books, authors, and genres.');
  addBullet(doc, '[NEW] frontend/src/pages/MyBookshelves.jsx', 'Reader dashboard tab for "Want to Read", "Currently Reading", "Completed", and "Favorites".');
  addBullet(doc, '[NEW] frontend/src/components/BookComponents/BookshelfButton.jsx', 'Reusable quick-add button for adding any book to user shelves.');
  addBullet(doc, '[MODIFY] frontend/src/AppRoutes.jsx & navbar.jsx', 'Register /bookshelves route, trigger Ctrl+K global keyboard listener, and add theme toggle in navbar.');

  addSectionTitle(doc, '4. Verification & Testing Steps');
  doc.text('• Test Ctrl+K shortcut on Windows and Mac browsers.');
  doc.text('• Verify reading progress saving in localStorage / backend API.');
  doc.text('• Ensure SpeechSynthesis plays seamlessly across Chrome and Edge browsers.');

  doc.end();
}

// -------------------------------------------------------------
// PDF 2: Developer 2 (Frontend Co-Lead / Teammate A)
// -------------------------------------------------------------
function generateDev2PDF() {
  const doc = new PDFDocument({ margin: 40, size: 'LETTER' });
  const stream = fs.createWriteStream(path.join(outputDir, 'Developer_2_Frontend_Studio_Community_Guide.pdf'));
  doc.pipe(stream);

  createHeader(doc, 'Author Gallery - Upgrade Week Plan', 'Developer 2 (Frontend Co-Lead) Action Plan', 'Frontend Author Studio & Social');

  addSectionTitle(doc, '1. Scope of Work & Responsibilities');
  addBullet(doc, 'Primary Focus', 'Advanced Author Writing Studio (WYSIWYG), AI Writing Assistant Side Drawer, Chapter Comments & Quote Highlights, Discussion Hub, Visual Dashboard Analytics.');
  addBullet(doc, 'Git Feature Branch', 'feature/author-studio-community');
  addBullet(doc, 'Target Workplaces', 'frontend/src/components/AuthorComponents, frontend/src/components/BookComponents, frontend/src/pages');

  addSectionTitle(doc, '2. Git & Collaboration Commands');
  addCodeBlock(doc, [
    '# 1. Clone repository (if first time)',
    'git clone https://github.com/ManishBhattPC/Author-Gallery.git && cd Author-Gallery',
    '# 2. Switch to main & fetch latest',
    'git checkout main && git pull origin main',
    '# 3. Create your feature branch',
    'git checkout -b feature/author-studio-community',
    '# 4. Save work & push',
    'git add . && git commit -m "feat: added rich text editor and AI drawer"',
    'git push origin feature/author-studio-community'
  ]);

  addSectionTitle(doc, '3. Detailed File Implementation Checklist');
  
  addBullet(doc, '[NEW] frontend/src/components/AuthorComponents/RichTextEditor.jsx', 'Full WYSIWYG editor with bold/italics/headings, word count goal progress, auto-save timer, and chapter ordering.');
  addBullet(doc, '[MODIFY] frontend/src/pages/WriteBook.jsx', 'Embed the new RichTextEditor into the book creation and chapter drafting workspace.');
  addBullet(doc, '[NEW] frontend/src/components/AuthorComponents/AIWritingAssistantDrawer.jsx', 'Slide-over drawer inside editor for grammar suggestions, plot prompts, readability score, and chapter summarization.');
  addBullet(doc, '[NEW] frontend/src/components/BookComponents/ChapterComments.jsx', 'Comment section under book chapters for reader feedback and discussion.');
  addBullet(doc, '[NEW] frontend/src/components/BookComponents/QuoteHighlightModal.jsx', 'Selection popup modal to highlight memorable book quotes and share directly on Twitter or WhatsApp.');
  addBullet(doc, '[NEW] frontend/src/components/DashboardComponents/AnalyticsCharts.jsx', 'Visual charts (Recharts / Chart.js) for daily view trends, download spikes, and rating distribution.');
  addBullet(doc, '[MODIFY] frontend/src/pages/AuthorDashboard.jsx', 'Integrate visual analytics charts and milestone achievements.');
  addBullet(doc, '[NEW] frontend/src/pages/DiscussionHub.jsx', 'Book Club and community forum view with topic threads, filters, and replies.');

  addSectionTitle(doc, '4. Verification & Testing Steps');
  doc.text('• Test RichTextEditor auto-save timer (e.g. saves draft every 15 seconds).');
  doc.text('• Test responsiveness of AI Writing Assistant slide-over drawer.');
  doc.text('• Ensure quote sharing opens WhatsApp / Twitter web intent URLs correctly.');

  doc.end();
}

// -------------------------------------------------------------
// PDF 3: Developer 3 (Backend Engineer / Teammate B)
// -------------------------------------------------------------
function generateDev3PDF() {
  const doc = new PDFDocument({ margin: 40, size: 'LETTER' });
  const stream = fs.createWriteStream(path.join(outputDir, 'Developer_3_Backend_Engineer_Guide.pdf'));
  doc.pipe(stream);

  createHeader(doc, 'Author Gallery - Upgrade Week Plan', 'Developer 3 (Backend Engineer) Action Plan', 'Backend APIs & Schemas');

  addSectionTitle(doc, '1. Scope of Work & Responsibilities');
  addBullet(doc, 'Primary Focus', 'Database Schemas (Bookshelf, Comments, Forums, Series), REST API Endpoints, Aggregations for Analytics, AI Assistant Backend Stubs.');
  addBullet(doc, 'Git Feature Branch', 'feature/backend-api-schemas');
  addBullet(doc, 'Target Workplaces', 'backend/models, backend/controllers, backend/routes, backend/server.js');

  addSectionTitle(doc, '2. Git & Collaboration Commands');
  addCodeBlock(doc, [
    '# 1. Clone repository & enter backend directory',
    'git clone https://github.com/ManishBhattPC/Author-Gallery.git && cd Author-Gallery/backend',
    '# 2. Checkout main & create feature branch',
    'git checkout main && git pull origin main',
    'git checkout -b feature/backend-api-schemas',
    '# 3. Commit & push endpoints',
    'git add . && git commit -m "feat: created bookshelf and comment models & routes"',
    'git push origin feature/backend-api-schemas'
  ]);

  addSectionTitle(doc, '3. Detailed File Implementation Checklist');
  
  addBullet(doc, '[NEW] backend/models/Bookshelf.js', 'Mongoose schema mapping user to book lists (wantToRead, reading, completed, favorites).');
  addBullet(doc, '[NEW] backend/models/ChapterComment.js', 'Mongoose schema for bookId, chapterIndex, userId, content, and createdAt timestamp.');
  addBullet(doc, '[NEW] backend/models/ForumThread.js', 'Mongoose schema for user discussions, categories (General, Writing Advice, Book Club), and replies array.');
  addBullet(doc, '[NEW] backend/models/BookSeries.js', 'Mongoose schema for grouping books into volume/series collections.');
  addBullet(doc, '[NEW] backend/controllers & routes/bookshelfRoutes.js', 'GET /api/bookshelves, POST /api/bookshelves/add, DELETE /api/bookshelves/remove.');
  addBullet(doc, '[NEW] backend/controllers & routes/commentRoutes.js', 'GET /api/comments/:bookId/:chapterIndex, POST /api/comments/create.');
  addBullet(doc, '[NEW] backend/controllers & routes/discussionRoutes.js', 'GET /api/discussions, POST /api/discussions/create, POST /api/discussions/:id/reply.');
  addBullet(doc, '[NEW] backend/controllers & routes/aiAssistantRoutes.js', 'POST /api/ai-assistant/grammar-check, POST /api/ai-assistant/summarize, POST /api/ai-assistant/plot-ideas.');
  addBullet(doc, '[MODIFY] backend/controllers/dashboardController.js', 'Aggregate daily view stats, PDF download metrics, and rating breakdowns for charting.');
  addBullet(doc, '[MODIFY] backend/server.js', 'Register all 4 new API router middlewares under /api/.');

  addSectionTitle(doc, '4. Verification & Testing Steps');
  doc.text('• Test all new endpoints with Postman or Thunder Client.');
  doc.text('• Verify authMiddleware protection on write endpoints (Bookshelf, Comments, Discussions).');
  doc.text('• Ensure MongoDB indexes exist for bookId and userId lookups.');

  doc.end();
}

console.log('Generating PDF Guides...');
generateDev1PDF();
generateDev2PDF();
generateDev3PDF();
console.log('Successfully generated 3 PDFs in task_guides/');
