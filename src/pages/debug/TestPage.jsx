import React, { useState, useEffect } from "react";
import { runAllTests, getTestResults } from "../../utils/testFunctionality.js";
import { useAuth } from "../../contexts/AuthContext";

const TestPage = () => {
  const { user, profile } = useAuth();
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [logs, setLogs] = useState([]);

  // Capture console logs
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      setLogs((prev) => [
        ...prev,
        {
          type: "log",
          message: args.join(" "),
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      originalLog(...args);
    };

    console.error = (...args) => {
      setLogs((prev) => [
        ...prev,
        {
          type: "error",
          message: args.join(" "),
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      originalError(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  const handleRunTests = async () => {
    setTesting(true);
    setLogs([]);
    setTestResults(null);

    try {
      const results = await runAllTests();
      setTestResults(results);
    } catch (error) {
      console.error("Test execution failed:", error);
    } finally {
      setTesting(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setTestResults(null);
  };

  return (
    <div className="min-h-screen bg-global-1 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🧪 Functionality Test Suite
          </h1>
          <p className="text-gray-400">
            Comprehensive testing for CRUD operations and scraping functionality
          </p>

          {user && (
            <div className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-green-300">
                ✅ Authenticated as: {profile?.name || user.email}
              </p>
            </div>
          )}

          {!user && (
            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300">
                ⚠️ Not authenticated - some tests may fail
              </p>
            </div>
          )}
        </div>

        {/* Test Controls */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={handleRunTests}
            disabled={testing}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 
                     text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            {testing ? "🔄 Running Tests..." : "🚀 Run All Tests"}
          </button>

          <button
            onClick={clearLogs}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            🗑️ Clear Logs
          </button>
        </div>

        {/* Test Results Summary */}
        {testResults && (
          <div className="mb-6 p-6 bg-global-2 rounded-lg border border-gray-600">
            <h2 className="text-xl font-bold text-white mb-4">
              📊 Test Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {testResults.summary.total}
                </div>
                <div className="text-gray-400">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {testResults.summary.passed}
                </div>
                <div className="text-gray-400">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {testResults.summary.failed}
                </div>
                <div className="text-gray-400">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {testResults.summary.passRate}
                </div>
                <div className="text-gray-400">Pass Rate</div>
              </div>
            </div>

            <div
              className={`mt-4 p-4 rounded-lg ${
                testResults.summary.failed === 0
                  ? "bg-green-900/20 border border-green-500/30"
                  : "bg-red-900/20 border border-red-500/30"
              }`}
            >
              <p
                className={`font-medium ${
                  testResults.summary.failed === 0
                    ? "text-green-300"
                    : "text-red-300"
                }`}
              >
                {testResults.summary.failed === 0
                  ? "🎉 All tests passed! The codebase is ready for production."
                  : "⚠️ Some tests failed. Check the detailed logs below."}
              </p>
            </div>
          </div>
        )}

        {/* Detailed Test Results */}
        {testResults && (
          <div className="mb-6 p-6 bg-global-2 rounded-lg border border-gray-600">
            <h2 className="text-xl font-bold text-white mb-4">
              📋 Detailed Results
            </h2>

            {/* Database Tests */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                🗄️ Database Tests
              </h3>
              <div className="space-y-2">
                <div
                  className={`flex items-center gap-2 ${
                    testResults.database.connection?.success
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {testResults.database.connection?.success ? "✅" : "❌"}{" "}
                  Database Connection
                </div>

                {testResults.database.tables && (
                  <div className="ml-6 text-sm text-gray-400">
                    {Object.entries(testResults.database.tables).map(
                      ([table, status]) => (
                        <div
                          key={table}
                          className={`flex items-center gap-2 ${
                            status.exists ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {status.exists ? "✅" : "❌"} {table} table
                          {status.error && (
                            <span className="text-red-300">
                              ({status.error})
                            </span>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* CRUD Tests */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-green-400 mb-2">
                📝 CRUD Tests
              </h3>
              <div className="space-y-2 text-sm">
                {testResults.crud.eventCreate && (
                  <div className="flex items-center gap-2 text-green-400">
                    ✅ Event CREATE operation
                  </div>
                )}
                {testResults.crud.eventRead && (
                  <div className="flex items-center gap-2 text-green-400">
                    ✅ Event READ operation
                  </div>
                )}
                {testResults.crud.eventUpdate && (
                  <div className="flex items-center gap-2 text-green-400">
                    ✅ Event UPDATE operation
                  </div>
                )}
                {testResults.crud.eventDelete && (
                  <div className="flex items-center gap-2 text-green-400">
                    ✅ Event DELETE operation
                  </div>
                )}
                {testResults.crud.incrementDecrement && (
                  <div className="flex items-center gap-2 text-green-400">
                    ✅ Increment/Decrement operations
                  </div>
                )}
                {testResults.crud.error && (
                  <div className="flex items-center gap-2 text-red-400">
                    ❌ CRUD Error: {testResults.crud.error}
                  </div>
                )}
              </div>
            </div>

            {/* Scraping Tests */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-orange-400 mb-2">
                🌐 Scraping Tests
              </h3>
              <div className="space-y-2 text-sm">
                {testResults.scraping.singleUrl && (
                  <div
                    className={`flex items-center gap-2 ${
                      testResults.scraping.singleUrl.success
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {testResults.scraping.singleUrl.success ? "✅" : "⚠️"}
                    Single URL Scraping ({
                      testResults.scraping.singleUrl.count
                    }{" "}
                    events)
                  </div>
                )}
                {testResults.scraping.liveUrl && (
                  <div
                    className={`flex items-center gap-2 ${
                      testResults.scraping.liveUrl.success
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {testResults.scraping.liveUrl.success ? "✅" : "⚠️"}
                    Live Scraping ({testResults.scraping.liveUrl.count} events)
                  </div>
                )}
                {testResults.scraping.batchUrls && (
                  <div
                    className={`flex items-center gap-2 ${
                      testResults.scraping.batchUrls.success
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {testResults.scraping.batchUrls.success ? "✅" : "⚠️"}
                    Batch Scraping (
                    {testResults.scraping.batchUrls.successfulUrls}/
                    {testResults.scraping.batchUrls.totalUrls} URLs)
                  </div>
                )}
                {testResults.scraping.capability && (
                  <div className="flex items-center gap-2 text-green-400">
                    ✅ Scraping Capability Check
                  </div>
                )}
                {testResults.scraping.error && (
                  <div className="flex items-center gap-2 text-red-400">
                    ❌ Scraping Error: {testResults.scraping.error}
                  </div>
                )}
              </div>
            </div>

            {/* Authentication */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                🔐 Authentication
              </h3>
              <div className="space-y-2 text-sm">
                {testResults.auth.user && (
                  <div
                    className={`flex items-center gap-2 ${
                      testResults.auth.user.success
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {testResults.auth.user.success ? "✅" : "⚠️"}
                    User Authentication
                    {testResults.auth.user.email && (
                      <span className="text-gray-400">
                        ({testResults.auth.user.email})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Live Logs */}
        <div className="p-6 bg-gray-900 rounded-lg border border-gray-600">
          <h2 className="text-xl font-bold text-white mb-4">
            📝 Live Test Logs
          </h2>
          <div className="max-h-96 overflow-y-auto bg-black p-4 rounded font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">
                No logs yet. Run tests to see output...
              </p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`mb-1 ${
                    log.type === "error" ? "text-red-400" : "text-green-400"
                  }`}
                >
                  <span className="text-gray-500">[{log.timestamp}]</span>{" "}
                  {log.message}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <a
            href="/home"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
