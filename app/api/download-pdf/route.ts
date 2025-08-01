import { type NextRequest, NextResponse } from "next/server"

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

    const { pdfUrl } = requestBody

    if (!pdfUrl) {
      return NextResponse.json(
        {
          error: "PDF URL is required",
          success: false,
        },
        { status: 400 },
      )
    }

    // In a real implementation, this would:
    // 1. Validate the PDF URL
    // 2. Fetch the PDF from the court website
    // 3. Handle authentication if required
    // 4. Stream the PDF back to the client

    // For demonstration, we'll create a mock PDF response
    const mockPdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 85
>>
stream
BT
/F1 12 Tf
72 720 Td
(Delhi High Court - Order Document) Tj
0 -20 Td
(This is a sample court order for demonstration.) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000410 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
507
%%EOF`

    const pdfBuffer = Buffer.from(mockPdfContent, "utf-8")

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="court_order.pdf"',
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error downloading PDF:", error)

    // Return JSON error response instead of throwing
    return NextResponse.json(
      {
        error: "Failed to download PDF",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error occurred",
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
