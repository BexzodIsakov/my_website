// app/analytics/page.js
"use client";

import { useEffect, useState } from "react";

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/analytics");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();

    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className='p-8'>Loading analytics...</div>;
  }

  if (!stats) {
    return <div className='p-8'>Error loading analytics</div>;
  }

  return (
    <div className='max-w-6xl mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-8'>Analytics Dashboard</h1>

      <div className='grid grid-cols-3 gap-4 mb-8'>
        <div className='p-6 rounded-lg shadow'>
          <div className='text-3xl font-bold text-blue-600'>
            {stats.totalViews}
          </div>
          <div className='text-gray-600'>Total Views</div>
        </div>
        <div className='p-6 rounded-lg shadow'>
          <div className='text-3xl font-bold text-blue-600'>
            {stats.uniqueVisitors}
          </div>
          <div className='text-gray-600'>Unique Visitors</div>
        </div>
        <div className='p-6 rounded-lg shadow'>
          <div className='text-3xl font-bold text-blue-600'>
            {stats.todayViews}
          </div>
          <div className='text-gray-600'>Views Today</div>
        </div>
      </div>

      <div className='p-6 rounded-lg shadow mb-8'>
        <h2 className='text-xl font-bold mb-4'>📄 Top Pages</h2>
        {stats.topPages.length > 0 ? (
          <table className='w-full'>
            <thead>
              <tr className='border-b'>
                <th className='text-left py-2'>Page</th>
                <th className='text-right py-2'>Views</th>
              </tr>
            </thead>
            <tbody>
              {stats.topPages.map(([page, count]: [string, number]) => (
                <tr key={page} className='border-b'>
                  <td className='py-2'>{page}</td>
                  <td className='text-right'>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='text-gray-500'>No data yet</p>
        )}
      </div>

      <div className='p-6 rounded-lg shadow'>
        <h2 className='text-xl font-bold mb-4'>🔗 Top Referrers</h2>
        {stats.topReferrers.length > 0 ? (
          <table className='w-full'>
            <thead>
              <tr className='border-b'>
                <th className='text-left py-2'>Source</th>
                <th className='text-right py-2'>Views</th>
              </tr>
            </thead>
            <tbody>
              {stats.topReferrers.map(([ref, count]: [string, number]) => (
                <tr key={ref} className='border-b'>
                  <td className='py-2'>{ref}</td>
                  <td className='text-right'>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='text-gray-500'>No referrer data yet</p>
        )}
      </div>
    </div>
  );
}
