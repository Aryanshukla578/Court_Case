# Court Data Fetcher & Mini-Dashboard

A web application for fetching and displaying case information from Indian courts, specifically targeting the Delhi High Court public records system.

## 🎯 Objective

This application allows users to search for case information by providing Case Type, Case Number, and Filing Year, then displays comprehensive case metadata including parties, dates, and downloadable court orders/judgments.

## 🏛️ Target Court

**Delhi High Court** (https://delhihighcourt.nic.in/)

*Note: This implementation uses mock data for demonstration purposes. In a production environment, it would integrate with the actual court website's public API or scraping mechanisms.*

## ✨ Features

### 1. User Interface
- Clean, responsive form with dropdown for case types
- Input fields for case number and filing year
- Real-time validation and error handling
- Professional dashboard-style layout

### 2. Backend Functionality
- RESTful API endpoints for case data fetching
- Simulated court website interaction (bypasses view-state tokens/CAPTCHA)
- Comprehensive error handling for various scenarios
- PDF download functionality

### 3. Data Storage
- PostgreSQL database integration using Neon
- Logging of all queries with timestamps and metadata
- Storage of raw response data in JSONB format
- Analytics view for query tracking

### 4. Data Display
- Structured presentation of case information
- Parties' names and case details
- Filing and next hearing dates
- Downloadable PDF links for orders/judgments
- Status badges and visual indicators

### 5. Error Handling
- User-friendly error messages
- Specific handling for:
  - Invalid case numbers
  - Court website downtime
  - Missing required fields
  - Network connectivity issues

## 🛠️ Technical Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (Neon)
- **Scraping**: Cheerio (for HTML parsing)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 📋 Functional Requirements Implementation

### ✅ UI - Simple Form
- Dropdown for Case Type selection
- Input fields for Case Number and Filing Year
- Form validation and submission handling

### ✅ Backend - Court Data Fetching
- API endpoint \`/api/fetch-case\` for data retrieval
- Simulated bypass of view-state tokens/CAPTCHA
- Parsing of:
  - Parties' names (Petitioner/Respondent)
  - Filing & next hearing dates
  - Order/judgment PDF links

### ✅ Storage - Query Logging
- PostgreSQL database with three main tables:
  - \`case_queries\`: Logs all search requests
  - \`case_responses\`: Stores parsed case data
  - \`pdf_downloads\`: Tracks PDF download activity

### ✅ Display - Parsed Details
- Structured cards showing case overview
- Parties information section
- Important dates display
- Recent orders with download links

### ✅ Error Handling
- Comprehensive error messages for:
  - Case not found (try case number: 99999)
  - Website unavailable (try case number: 00000)
  - Invalid input validation
  - Network and server errors

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon account recommended)

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`env
   DATABASE_URL=your_neon_database_url
   \`\`\`

4. Run database migrations:
   - Execute the SQL script in \`scripts/001_create_tables.sql\`

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing the Application

### Sample Test Cases

1. **Successful Case Lookup**:
   - Case Type: Writ Petition (W.P.)
   - Case Number: 12345
   - Filing Year: 2024

2. **Civil Suit Example**:
   - Case Type: Civil Suit (C.S.)
   - Case Number: 67890
   - Filing Year: 2023

3. **Error Testing**:
   - Case Number: 99999 (triggers "Case not found" error)
   - Case Number: 00000 (triggers "Website unavailable" error)

## 🔒 Legal and Ethical Considerations

- This application accesses only publicly available court records
- All data fetched is already in the public domain
- The system respects court website terms of service
- No private or confidential information is accessed
- Rate limiting should be implemented for production use

## 🔧 Production Deployment Considerations

### Real Court Website Integration
For production deployment with actual court websites:

1. **CAPTCHA Handling**: Implement CAPTCHA solving services or manual intervention
2. **Session Management**: Handle court website sessions and cookies
3. **Rate Limiting**: Implement respectful request throttling
4. **Error Recovery**: Robust retry mechanisms for network failures
5. **Data Validation**: Enhanced validation of scraped data
6. **Monitoring**: Logging and alerting for scraping failures

### Security Measures
- Input sanitization and validation
- SQL injection prevention
- XSS protection
- Rate limiting per IP address
- Secure PDF handling

## 📊 Database Schema

### Tables
- \`case_queries\`: Query logging and tracking
- \`case_responses\`: Parsed case data storage
- \`pdf_downloads\`: PDF download tracking
- \`query_analytics\`: Analytics view for reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational and research purposes. Please ensure compliance with court website terms of service and applicable laws when using this system.

## ⚠️ Disclaimer

This application is designed for accessing publicly available court records. Users are responsible for ensuring their use complies with all applicable laws and court website terms of service. The developers are not responsible for any misuse of this system.
