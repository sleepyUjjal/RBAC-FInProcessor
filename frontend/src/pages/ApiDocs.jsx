import React from 'react';
import { Link } from 'react-router-dom';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const ApiDocs = () => {
  // Resolve the backend URL based on environment. Matches client.js resolution strategy.
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  
  // Construct the URL to the OpenAPI schema.
  // When running via Vite local proxy, VITE_API_BASE_URL is empty, so it uses relative /api/schema/
  const schemaUrl = `${API_BASE_URL}/api/schema/`;

  return (
    <section className="glass-panel mx-auto w-full max-w-6xl overflow-hidden fade-in-up bg-white">
      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl text-gradient">API Documentation</h2>
            <p className="text-sm mt-1 text-[var(--text)]">
              Explore and test the FinProcessor endpoints interactively.
            </p>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--text-h)] shadow-[var(--shadow-sm)] border border-[var(--border)] hover:bg-[var(--surface-muted)] transition-colors self-start md:self-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Home
          </Link>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white overflow-x-auto p-4 md:p-6 shadow-sm">
          {/* Custom scoped styles to override swagger-ui defaults if needed to fix layout */}
          <div className="swagger-container">
            <SwaggerUI url={schemaUrl} />
          </div>
        </div>
      </div>
      <style>{`
        .swagger-container .swagger-ui .info { margin: 20px 0; }
        .swagger-container .swagger-ui .wrapper { padding: 0; max-width: 100%; }
      `}</style>
    </section>
  );
};

export default ApiDocs;
