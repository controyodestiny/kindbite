import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import { STORAGE_KEYS } from '../../config/api';

const AuthDebugger = () => {
  const { user, isAuthenticated } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    const updateDebugInfo = () => {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

      setDebugInfo({
        accessToken: accessToken ? 'Present' : 'Missing',
        refreshToken: refreshToken ? 'Present' : 'Missing',
        savedUser: savedUser ? 'Present' : 'Missing',
        isAuthenticated,
        user: user ? 'Present' : 'Missing',
        userEmail: user?.email || 'N/A'
      });
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, [user, isAuthenticated]);

  const testEndpoint = async (endpoint, name) => {
    try {
      console.log(`Testing ${name}...`);
      const result = await apiService.request(endpoint, { requiresAuth: true });
      setTestResults(prev => ({
        ...prev,
        [name]: { status: 'success', data: result }
      }));
    } catch (error) {
      console.error(`${name} failed:`, error);
      setTestResults(prev => ({
        ...prev,
        [name]: { status: 'error', error: error.message, statusCode: error.status }
      }));
    }
  };

  const testAllEndpoints = async () => {
    setTestResults({});
    
    await testEndpoint('/auth/me/', 'Get Current User');
    await testEndpoint('/foods/stats/', 'Food Stats');
    await testEndpoint('/foods/listings/', 'Food Listings');
    await testEndpoint('/foods/reservations/my/', 'My Reservations');
  };

  const clearTokens = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="font-bold text-lg mb-2">Auth Debugger</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Current State:</h4>
        <div className="text-sm space-y-1">
          {Object.entries(debugInfo).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium">{key}:</span>
              <span className={value === 'Present' ? 'text-green-600' : 'text-red-600'}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={testAllEndpoints}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 mb-2"
        >
          Test All Endpoints
        </button>
        
        <button
          onClick={clearTokens}
          className="w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
        >
          Clear Tokens & Reload
        </button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Test Results:</h4>
          <div className="text-sm space-y-1">
            {Object.entries(testResults).map(([name, result]) => (
              <div key={name} className="flex justify-between">
                <span className="font-medium">{name}:</span>
                <span className={result.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                  {result.status === 'success' ? 'Success' : `Error (${result.statusCode})`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDebugger;








