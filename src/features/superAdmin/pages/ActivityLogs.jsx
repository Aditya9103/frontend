import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import superAdminService from '../../../core/services/superAdmin.service';
import SuperAdminSidebar from '../components/SuperAdminSidebar';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [logCount, setLogCount] = useState(0);

  const fetchLogs = async () => {
    try {
      const response = await superAdminService.getActivityLogs();
      if (response.data.success) {
        setLogs(response.data.logs);
      }
    } catch (error) {
      toast.error('Failed to load logs');
    }
  };

  const checkOldLogs = async () => {
    try {
      const res = await superAdminService.requestLogDeletion({ days: 90 });
      if (res.data.success) {
        setLogCount(res.data.count);
        if (res.data.count > 0) {
          if (window.confirm(`Found ${res.data.count} logs older than 90 days. Approve deletion?`)) {
            const delRes = await superAdminService.executeLogDeletion({ dateLimit: res.data.dateLimit });
            toast.success(delRes.data.message);
            fetchLogs();
            setLogCount(0);
          }
        } else {
          toast.success("No old logs to delete.");
        }
      }
    } catch (error) {
      toast.error("Failed to check logs.");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <SuperAdminSidebar />
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">System Activity Logs</h1>
          <button onClick={checkOldLogs} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Clean Up Old Logs
          </button>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Module</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{new Date(log.createdAt).toLocaleString()}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{log.userId?.email || 'System'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">{log.action}</span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{log.module}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-500 whitespace-no-wrap text-xs">{log.description}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
