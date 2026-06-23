import { getMyBooks } from "./bookService.js";

export const getAuthorStats = async () => {
  try {
    const books = await getMyBooks(); // Fetch all author's books

    // Calculate total value by summing all book prices
    const totalValue = books.reduce(
      (sum, book) => sum + Number(book.price || 0),
      0
    );

    // Get all unique genres across books
    const allGenres = books.flatMap((book) => book.genres || []);
    const totalGenres = new Set(allGenres).size; // Count unique genres

    // Sort books by publish date (newest first)
    const sortedBooks = books
      .slice()
      .sort(
        (a, b) =>
          new Date(b.publishDate || b.createdAt) -
          new Date(a.publishDate || a.createdAt)
      );

    return {
      published: books.length, // Total published books
      totalValue, // Sum of all book prices
      totalGenres, // Unique genre count
      lastPublished: sortedBooks[0]?.publishDate || sortedBooks[0]?.createdAt || null, // Most recent book
      followers: 0, // Placeholder - followers system coming later
      following: 0, // Placeholder - following system coming later
    };
  } catch (error) {
    console.error("Error fetching author stats:", error);
    return {
      published: 0,
      totalValue: 0,
      totalGenres: 0,
      lastPublished: null,
      followers: 0,
      following: 0,
    };
  }
};

export const getAuthorActivity = async () => {
  try {
    const books = await getMyBooks(); // Fetch all author's books

    // Sort by creation date (newest first) and get last 3 books
    return books
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.publishDate) -
          new Date(a.createdAt || a.publishDate)
      )
      .slice(0, 3); // Return only 3 most recent books
  } catch (error) {
    console.error("Error fetching author activity:", error);
    return [];
  }
};

export const getAuthorBooks = async () => {
  try {
    return await getMyBooks(); // Fetch all author's books
  } catch (error) {
    console.error("Error fetching author books:", error);
    return [];
  }
};

/*
Future Roadmap

1. Followers & Following System
--------------------------------
- Replace placeholder values with real API calls
- getUserFollowers() - get list of followers
- getUserFollowing() - get list of following
- Increment on user follow action

2. Advanced Stats
--------------------------------
- Total views across all books
- Total downloads count
- Average rating per book
- Total earnings/revenue

3. Analytics Over Time
--------------------------------
- Views graph (daily/weekly/monthly)
- Downloads trend
- New follower growth chart
- Revenue tracking

4. Real-time Updates
--------------------------------
- WebSocket for live follower count
- Live view/download counters
- Instant notifications

5. Performance Metrics
--------------------------------
- Best performing book (by views)
- Best performing book (by downloads)
- Most reviewed book
- Highest rated book

6. Caching Strategy
--------------------------------
- Cache stats for 5 minutes to reduce API calls
- Invalidate cache on book creation/update/delete
- Manual refresh option

7. Export Statistics
--------------------------------
- Export stats as PDF/CSV
- Monthly reports
- Year-end summaries
*/