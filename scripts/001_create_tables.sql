-- Create database tables for storing case queries and responses

-- Table to log all case queries
CREATE TABLE IF NOT EXISTS case_queries (
    id VARCHAR(255) PRIMARY KEY,
    case_type VARCHAR(100) NOT NULL,
    case_number VARCHAR(100) NOT NULL,
    filing_year VARCHAR(4) NOT NULL,
    query_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to store case response data
CREATE TABLE IF NOT EXISTS case_responses (
    id SERIAL PRIMARY KEY,
    query_id VARCHAR(255) REFERENCES case_queries(id),
    case_data JSONB NOT NULL,
    response_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processing_time_ms INTEGER,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to track PDF downloads
CREATE TABLE IF NOT EXISTS pdf_downloads (
    id SERIAL PRIMARY KEY,
    query_id VARCHAR(255) REFERENCES case_queries(id),
    pdf_url TEXT NOT NULL,
    download_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_size_bytes INTEGER,
    download_success BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_case_queries_timestamp ON case_queries(query_timestamp);
CREATE INDEX IF NOT EXISTS idx_case_queries_case_details ON case_queries(case_type, case_number, filing_year);
CREATE INDEX IF NOT EXISTS idx_case_responses_query_id ON case_responses(query_id);
CREATE INDEX IF NOT EXISTS idx_pdf_downloads_query_id ON pdf_downloads(query_id);

-- Create a view for query analytics
CREATE OR REPLACE VIEW query_analytics AS
SELECT 
    cq.case_type,
    COUNT(*) as total_queries,
    COUNT(CASE WHEN cr.success = true THEN 1 END) as successful_queries,
    COUNT(CASE WHEN cr.success = false THEN 1 END) as failed_queries,
    AVG(cr.processing_time_ms) as avg_processing_time_ms,
    DATE_TRUNC('day', cq.query_timestamp) as query_date
FROM case_queries cq
LEFT JOIN case_responses cr ON cq.id = cr.query_id
GROUP BY cq.case_type, DATE_TRUNC('day', cq.query_timestamp)
ORDER BY query_date DESC, total_queries DESC;
