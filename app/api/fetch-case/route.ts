import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Initialize database connection with error handling
let sql: any = null
try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL)
  }
} catch (error) {
  console.error("Database connection error:", error)
}

// Mock data for demonstration - In real implementation, this would scrape the actual court website
const mockCaseData: Record<string, any> = {
  // Writ Petition cases
  writ_12345_2024: {
    id: "case_001",
    caseNumber: "W.P.(C) 12345/2024",
    caseType: "Writ Petition (Civil)",
    filingYear: "2024",
    parties: {
      petitioner: "ABC Corporation Ltd.",
      respondent: "Union of India & Ors.",
    },
    filingDate: "15/03/2024",
    nextHearingDate: "25/01/2025",
    status: "Active",
    orders: [
      {
        date: "20/12/2024",
        description: "Notice issued to respondents. Reply to be filed within 4 weeks.",
        pdfUrl: "https://example.com/order_20122024.pdf",
      },
      {
        date: "15/03/2024",
        description: "Petition filed. Defects pointed out.",
        pdfUrl: "https://example.com/order_15032024.pdf",
      },
    ],
    lastUpdated: new Date().toLocaleString("en-IN"),
  },
  writ_54321_2024: {
    id: "case_003",
    caseNumber: "W.P.(C) 54321/2024",
    caseType: "Writ Petition (Civil)",
    filingYear: "2024",
    parties: {
      petitioner: "Citizens Welfare Association",
      respondent: "State of Delhi & Ors.",
    },
    filingDate: "10/01/2024",
    nextHearingDate: "15/02/2025",
    status: "Active",
    orders: [
      {
        date: "05/01/2025",
        description: "Counter affidavit filed by respondents. Rejoinder to be filed within 2 weeks.",
        pdfUrl: "https://example.com/order_05012025.pdf",
      },
    ],
    lastUpdated: new Date().toLocaleString("en-IN"),
  },
  // Civil Suit cases
  civil_67890_2023: {
    id: "case_002",
    caseNumber: "C.S. 67890/2023",
    caseType: "Civil Suit",
    filingYear: "2023",
    parties: {
      petitioner: "XYZ Private Limited",
      respondent: "DEF Industries & Anr.",
    },
    filingDate: "10/08/2023",
    nextHearingDate: "30/01/2025",
    status: "Active",
    orders: [
      {
        date: "15/12/2024",
        description: "Arguments heard. Judgment reserved.",
        pdfUrl: "https://example.com/order_15122024.pdf",
      },
      {
        date: "22/11/2024",
        description: "Evidence recorded. Final arguments on next date.",
      },
    ],
    lastUpdated: new Date().toLocaleString("en-IN"),
  },
  civil_11111_2024: {
    id: "case_004",
    caseNumber: "C.S. 11111/2024",
    caseType: "Civil Suit",
    filingYear: "2024",
    parties: {
      petitioner: "Tech Solutions Pvt. Ltd.",
      respondent: "Innovation Corp & Ors.",
    },
    filingDate: "20/06/2024",
    nextHearingDate: "10/02/2025",
    status: "Active",
    orders: [
      {
        date: "28/12/2024",
        description: "Interim application disposed of. Main matter for hearing.",
        pdfUrl: "https://example.com/order_28122024.pdf",
      },
    ],
    lastUpdated: new Date().toLocaleString("en-IN"),
  },
  // Criminal cases
  criminal_98765_2024: {
    id: "case_005",
    caseNumber: "Crl. 98765/2024",
    caseType: "Criminal Case",
    filingYear: "2024",
    parties: {
      petitioner: "State vs. John Doe",
      respondent: "John Doe",
    },
    filingDate: "05/09/2024",
    nextHearingDate: "20/02/2025",
    status: "Active",
    orders: [
      {
        date: "10/01/2025",
        description: "Bail application heard. Order reserved.",
        pdfUrl: "https://example.com/order_10012025.pdf",
      },
    ],
    lastUpdated: new Date().toLocaleString("en-IN"),
  },
}

async function scrapeCourtData(caseType: string, caseNumber: string, filingYear: string) {
  // In a real implementation, this would:
  // 1. Construct the proper URL for Delhi High Court
  // 2. Handle any CAPTCHA or view-state tokens
  // 3. Make HTTP requests with proper headers
  // 4. Parse the HTML response using cheerio
  // 5. Extract case details, parties, dates, and order links

  // Create case key using underscore separator
  const caseKey = `${caseType}_${caseNumber}_${filingYear}`

  console.log(`Looking for case with key: ${caseKey}`)
  console.log(`Available keys:`, Object.keys(mockCaseData))

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Return mock data or throw error for demonstration
  if (mockCaseData[caseKey]) {
    console.log(`Found case data for key: ${caseKey}`)
    return mockCaseData[caseKey]
  }

  // Simulate different types of errors
  if (caseNumber === "99999") {
    throw new Error("Case not found. Please verify the case number and try again.")
  }

  if (caseNumber === "00000") {
    throw new Error("Court website is currently unavailable. Please try again later.")
  }

  // Provide helpful error message with available test cases
  const availableCases = Object.keys(mockCaseData)
    .map((key) => {
      const [type, number, year] = key.split("_")
      return `${type} - ${number} - ${year}`
    })
    .join(", ")

  throw new Error(`No case found with the provided details. Available test cases: ${availableCases}`)
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body with error handling
    let requestBody
    try {
      requestBody = await request.json()
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          success: false,
        },
        { status: 400 },
      )
    }

    const { caseType, caseNumber, filingYear } = requestBody

    // Validate required fields
    if (!caseType || !caseNumber || !filingYear) {
      return NextResponse.json(
        {
          error: "Missing required fields: caseType, caseNumber, filingYear",
          success: false,
        },
        { status: 400 },
      )
    }

    // Generate query ID
    const queryId = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Log the query to database (optional, continues if fails)
    if (sql) {
      try {
        await sql`
          INSERT INTO case_queries (id, case_type, case_number, filing_year, query_timestamp, ip_address)
          VALUES (${queryId}, ${caseType}, ${caseNumber}, ${filingYear}, NOW(), ${request.headers.get("x-forwarded-for") || "unknown"})
        `
      } catch (dbError) {
        console.error("Database logging error:", dbError)
        // Continue with the request even if logging fails
      }
    }

    // Scrape court data
    const caseData = await scrapeCourtData(caseType, caseNumber, filingYear)

    // Store the response in database (optional, continues if fails)
    if (sql) {
      try {
        await sql`
          INSERT INTO case_responses (query_id, case_data, response_timestamp)
          VALUES (${queryId}, ${JSON.stringify(caseData)}, NOW())
        `
      } catch (dbError) {
        console.error("Database storage error:", dbError)
        // Continue with the response even if storage fails
      }
    }

    return NextResponse.json({
      success: true,
      data: caseData,
      queryId,
    })
  } catch (error) {
    console.error("Error fetching case data:", error)

    // Ensure we always return valid JSON
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch case data"

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details:
          "Please verify the case details and try again. If the problem persists, the court website may be temporarily unavailable.",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
