import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import apiService from '../../services/apiService';
import { API_CONFIG } from '../../config/api';
import { useToast } from '../../contexts/ToastContext';

const ApiConnectionTest = ({ onClose }) => {
  const [status, setStatus] = useState('testing');
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);
  const toast = useToast();

  const tests = [
    {
      name: 'API Server Connection',
      test: () => apiService.getAuthStatus(),
      key: 'connection'
    },
    {
      name: 'Authentication Endpoints',
      test: () => fetch(`${API_CONFIG.BASE_URL}/auth/status/`),
      key: 'auth'
    }
  ];

  const runTests = async () => {
    setStatus('testing');
    setError(null);
    const newResults = {};

    for (const test of tests) {
      try {
        await test.test();
        newResults[test.key] = { success: true, message: 'Connected successfully' };
      } catch (err) {
        newResults[test.key] = { 
          success: false, 
          message: err.message || 'Connection failed' 
        };
      }
    }

    setResults(newResults);
    setStatus('completed');
    
    // Show toast notification
    const allPassed = Object.values(newResults).every(result => result.success);
    if (allPassed) {
      toast.success('API connection test passed! Backend is working correctly.');
    } else {
      toast.error('API connection test failed. Please check your backend server.');
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (result) => {
    if (!result) return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
    return result.success ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const allTestsPassed = Object.values(results).every(result => result?.success);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">API Connection Test</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-3 mb-4">
          <div className="text-sm text-gray-600">
            Testing connection to: <code className="bg-gray-100 px-1 rounded">{API_CONFIG.BASE_URL}</code>
          </div>

          {tests.map((test) => (
            <div key={test.key} className="flex items-center space-x-3 p-2 border rounded">
              {getStatusIcon(results[test.key])}
              <div className="flex-1">
                <div className="font-medium text-sm">{test.name}</div>
                {results[test.key] && (
                  <div className={`text-xs ${results[test.key].success ? 'text-green-600' : 'text-red-600'}`}>
                    {results[test.key].message}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {status === 'completed' && (
          <div className={`p-3 rounded-lg ${allTestsPassed ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <div className="flex items-center space-x-2">
              {allTestsPassed ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-medium">
                {allTestsPassed ? 'All tests passed! API is ready.' : 'Some tests failed. Check your backend server.'}
              </span>
            </div>
            {!allTestsPassed && (
              <div className="mt-2 text-sm">
                Make sure your Django backend is running on <code>{API_CONFIG.BASE_URL.replace('/api/v1', '')}</code>
              </div>
            )}
          </div>
        )}

        <div className="flex space-x-2 mt-4">
          <button
            onClick={runTests}
            disabled={status === 'testing'}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {status === 'testing' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Retry Tests</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiConnectionTest;
