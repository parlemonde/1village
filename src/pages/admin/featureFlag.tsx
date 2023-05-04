import React, { useState, useEffect, useMemo } from 'react';

import { getUsers } from 'src/api/user/user.get';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { User } from 'types/user.type';

interface FeatureFlag {
  id: number;
  name: string;
  isEnabled: boolean;
  users: User[];
}

const FeatureFlagsTest: React.FC = () => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [newFeatureFlag, setNewFeatureFlag] = useState({ name: '', isEnabled: false });
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [userFilter, setUserFilter] = useState<string>('');

  useEffect(() => {
    fetchFeatureFlags();
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const fetchFeatureFlags = async () => {
    const response = await axiosRequest({
      method: 'GET',
      url: `/featureFlags`,
    });

    if (response.error) {
      return [];
    }

    setFeatureFlags(response.data);

    return response.data;
  };

  const handleNewFeatureFlagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFeatureFlag({ ...newFeatureFlag, [event.target.name]: event.target.value });
  };

  const handleSelectedFlagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedFlag) {
      setSelectedFlag({ ...selectedFlag, [event.target.name]: event.target.value });
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFeatureFlag({ ...newFeatureFlag, isEnabled: event.target.checked });
  };

  const handleUserFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserFilter(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newFeatureFlag.name) {
      alert('Please enter a name for the feature flag.');
      return;
    }

    const response = await axiosRequest({
      method: 'POST',
      url: `/featureFlags`,
      data: {
        name: newFeatureFlag.name,
        isEnabled: newFeatureFlag.isEnabled,
        users: selectedUsers, // Add the selected user IDs to the request data
      },
    });

    if (response.data) {
      fetchFeatureFlags();
      setNewFeatureFlag({ name: '', isEnabled: false });
      setSelectedUsers([]); // Reset the selected user IDs
    } else {
      alert('Error creating the feature flag. Please try again.');
    }
  };

  const handleUpdate = async (id: number) => {
    if (!selectedFlag) return;

    const response = await axiosRequest({
      method: 'PUT',
      url: `/featureFlags/${id}`,
      data: {
        ...selectedFlag,
        userIds: selectedFlag.users?.map((user) => user.id),
      },
    });

    if (response.data) {
      fetchFeatureFlags();
      setSelectedFlag(null);
    }
  };

  const handleDelete = async (id: number) => {
    const response = await axiosRequest({
      method: 'DELETE',
      url: `/featureFlags/${id}`,
    });

    if (response.data) {
      fetchFeatureFlags();
    }
  };

  const filteredUsers = useMemo(() => {
    if (userFilter) {
      return users.filter((user) => user.email.toLowerCase().includes(userFilter.toLowerCase()));
    } else {
      return users;
    }
  }, [users, userFilter]);

  const handleAddUser = (userId: number) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (!prevSelectedUsers.includes(userId)) {
        return [...prevSelectedUsers, userId];
      }
      return prevSelectedUsers;
    });
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers((prevSelectedUsers) => prevSelectedUsers.filter((id) => id !== userId));
  };

  return (
    <div>
      <h1>Feature de la mort qui aaaa</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={newFeatureFlag.name} onChange={handleNewFeatureFlagChange} />
        </label>
        <label>
          Is Enabled:
          <input type="checkbox" name="isEnabled" checked={newFeatureFlag.isEnabled} onChange={handleCheckboxChange} />
        </label>
        <label>
          Users:
          <input type="text" placeholder="Filter users" value={userFilter} onChange={handleUserFilterChange} style={{ marginBottom: '1rem' }} />
          <ul>
            {filteredUsers.map((user) => (
              <li key={user.id}>
                {user.email}{' '}
                {selectedUsers.includes(user.id) ? (
                  <button type="button" onClick={() => handleRemoveUser(user.id)}>
                    -
                  </button>
                ) : (
                  <button type="button" onClick={() => handleAddUser(user.id)}>
                    +
                  </button>
                )}
              </li>
            ))}
          </ul>
        </label>
        <button type="submit">Add Feature Flag</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Is Enabled</th>
            <th>Users</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {featureFlags?.map((flag) => (
            <tr key={flag.id}>
              <td>{flag.id}</td>
              <td>
                {selectedFlag && selectedFlag.id === flag.id ? (
                  <input type="text" name="name" value={selectedFlag.name} onChange={handleSelectedFlagChange} />
                ) : (
                  flag.name
                )}
              </td>
              <td>
                {selectedFlag && selectedFlag.id === flag.id ? (
                  <input
                    type="checkbox"
                    name="isEnabled"
                    checked={selectedFlag.isEnabled}
                    onChange={(e) => setSelectedFlag({ ...selectedFlag, isEnabled: e.target.checked })}
                  />
                ) : (
                  flag.isEnabled.toString()
                )}
              </td>
              <td>{flag.users?.length}</td>
              <td>
                {selectedFlag && selectedFlag.id === flag.id ? (
                  <select
                    multiple
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
                      setSelectedFlag({ ...selectedFlag, users: users.filter((user) => selectedOptions.includes(user.id)) });
                    }}
                  >
                    {users?.map((user) => (
                      <option key={user.id} value={user.id} selected={selectedFlag.users?.some((u) => u.id === user.id)}>
                        {user.email}
                      </option>
                    ))}
                  </select>
                ) : (
                  flag.users?.map((user) => user.email).join(', ')
                )}
              </td>
              <td>
                {selectedFlag && selectedFlag.id === flag.id ? (
                  <>
                    <button onClick={() => handleUpdate(flag.id)}>Update</button>
                    <button onClick={() => setSelectedFlag(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setSelectedFlag(flag)}>Edit</button>
                )}
                <button onClick={() => handleDelete(flag.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeatureFlagsTest;
