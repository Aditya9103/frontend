import React, { useEffect, useState } from 'react';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import superAdminService from '../../../core/services/superAdmin.service';
import toast from 'react-hot-toast';

const AVAILABLE_PERMISSIONS = [
  { id: 'manage_users', label: 'Manage Users' },
  { id: 'manage_courses', label: 'Manage Courses' },
  { id: 'manage_payments', label: 'Manage Payments' },
  { id: 'manage_settings', label: 'Manage Settings' },
  { id: 'view_reports', label: 'View Reports' }
];

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ fullName: '', email: '', password: '' });
  const [selectedAdmin, setSelectedAdmin] = useState({ id: null, permissions: [] });

  const fetchAdmins = async () => {
    try {
      const response = await superAdminService.getUsers();
      if (response.data.success) {
        setAdmins(response.data.users.filter(u => u.role === 'ADMIN'));
      }
    } catch (error) {
      toast.error('Failed to load admins');
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await superAdminService.createAdmin(newAdmin);
      if (response.data.success) {
        toast.success('Admin created successfully');
        setShowCreateModal(false);
        setNewAdmin({ fullName: '', email: '', password: '' });
        fetchAdmins();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm('Are you sure you want to revoke admin access? They will become a standard user.')) return;
    try {
      const response = await superAdminService.updateRole(id, { role: 'USER' });
      if (response.data.success) {
        toast.success('Admin access revoked');
        fetchAdmins();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to revoke admin');
    }
  };

  const handleEditClick = (admin) => {
    setSelectedAdmin({ id: admin._id, permissions: admin.permissions || [] });
    setShowEditModal(true);
  };

  const handlePermissionToggle = (permId) => {
    setSelectedAdmin(prev => {
      const perms = prev.permissions;
      if (perms.includes(permId)) {
        return { ...prev, permissions: perms.filter(p => p !== permId) };
      } else {
        return { ...prev, permissions: [...perms, permId] };
      }
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await superAdminService.updateRole(selectedAdmin.id, { 
        role: 'ADMIN', 
        permissions: selectedAdmin.permissions 
      });
      if (response.data.success) {
        toast.success('Permissions updated successfully');
        setShowEditModal(false);
        fetchAdmins();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update permissions');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SuperAdminSidebar />
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Management</h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Create New Admin
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admin</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Permissions</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap font-medium">{admin.fullName}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{admin.email}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {admin.permissions && admin.permissions.length > 0 ? (
                      admin.permissions.map(p => {
                        const permObj = AVAILABLE_PERMISSIONS.find(perm => perm.id === p);
                        return <span key={p} className="bg-blue-100 text-blue-800 rounded px-2 py-1 mr-1 text-xs font-semibold inline-block mb-1">{permObj ? permObj.label : p}</span>;
                      })
                    ) : admin.permissions ? (
                      <span className="text-gray-500 italic text-xs">No permissions</span>
                    ) : (
                      <span className="text-gray-500 italic text-xs">All access (Legacy)</span>
                    )}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button onClick={() => handleEditClick(admin)} className="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Edit Perms</button>
                    <button onClick={() => handleRevoke(admin._id)} className="text-red-600 hover:text-red-900 font-semibold">Revoke</button>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center text-gray-500">
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Admin</h2>
            <form onSubmit={handleCreateAdmin}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500" 
                  value={newAdmin.fullName}
                  onChange={(e) => setNewAdmin({...newAdmin, fullName: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input 
                  type="email" 
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500" 
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input 
                  type="password" 
                  required
                  minLength="8"
                  autoComplete="new-password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring focus:border-blue-500" 
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                />
              </div>
              <div className="flex items-center justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-600 hover:text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Permissions Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Edit Permissions</h2>
            <p className="text-gray-500 text-sm mb-6">Select the modules this admin can access.</p>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-3 mb-6">
                {AVAILABLE_PERMISSIONS.map(perm => (
                  <label key={perm.id} className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-5 w-5 text-blue-600 rounded" 
                      checked={selectedAdmin.permissions.includes(perm.id)}
                      onChange={() => handlePermissionToggle(perm.id)}
                    />
                    <span className="text-gray-700 font-medium">{perm.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex items-center justify-end gap-4 mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-600 hover:text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
