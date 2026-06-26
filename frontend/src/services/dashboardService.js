import apiClient from "./apiClient.js";
import { getMyBooks } from "./bookService.js";
import { apiCache } from "./cacheManager.js";

export const getPublicSummaryStats = async () => {
  const cacheKey = "dashboard:public-summary";
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await apiClient.get("/api/dashboard/summary");
  
  apiCache.set(cacheKey, response.data, 30); // Cache for 30s
  return response.data;
};

export const getAuthorDashboard = async () => {
  const response = await apiClient.get("/api/dashboard/stats");

  return response.data;
};

export const getAuthorStats = async () => {
  try {
    const data = await getAuthorDashboard();

    return data.stats;
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
    const data = await getAuthorDashboard();

    return data.recentBooks || [];
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
