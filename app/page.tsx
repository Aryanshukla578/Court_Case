"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Search, Download, Calendar, Users, FileText, AlertCircle, Globe, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface CaseData {
  id: string
  caseNumber: string
  caseType: string
  filingYear: string
  parties: {
    petitioner: string
    respondent: string
  }
  filingDate: string
  nextHearingDate: string
  status: string
  orders: Array<{
    date: string
    description: string
    pdfUrl?: string
  }>
  lastUpdated: string
  source?: string
  scrapedAt?: string
}

const caseTypes = [
  { value: "writ", label: "Writ Petition (W.P.)" },
  { value: "civil", label: "Civil Suit (C.S.)" },
  { value: "criminal", label: "Criminal Case (Crl.)" },
  { value: "appeal", label: "Civil Appeal (C.A.)" },
  { value: "revision", label: "Civil Revision (C.R.)" },
  { value: "misc", label: "Miscellaneous (Misc.)" },
]

export default function CourtDataFetcher() {
  const [formData, setFormData] = useState({
    caseType: "",
    caseNumber: "",
    filingYear: new Date().getFullYear().toString(),
  })
  const [loading, setLoading] = useState(false)
  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.caseType || !formData.caseNumber || !formData.filingYear) {
      setError("Please fill in all required fields")
      return
    }

    // Validate case number
    if (!/^\d+$/.test(formData.caseNumber)) {
      setError("Case number must contain only digits")
      return
    }

    setLoading(true)
    setError(null)
    setCaseData(null)

    try {
      const response = await fetch("/api/fetch-case", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please try again.")
      }

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to fetch case data")
      }

      setCaseData(result.data)
    } catch (err) {
      console.error("Fetch error:", err)
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
          setError("Network error: Please check your internet connection and try again.")
        } else if (err.message.includes("JSON")) {
          setError("Server error: The server returned an invalid response. Please try again later.")
        } else {
          setError(err.message)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async (pdfUrl: string, filename: string) => {
    try {
      const response = await fetch("/api/download-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfUrl }),
      })

      // Check if response is a PDF
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/pdf")) {
        // Handle PDF download
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        // Handle JSON error response
        const result = await response.json()
        throw new Error(result.error || "Failed to download PDF")
      }
    } catch (err) {
      console.error("Download error:", err)
      setError("Failed to download PDF: " + (err instanceof Error ? err.message : "Unknown error"))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Court Data Fetcher</h1>
          <p className="text-lg text-gray-600">Real-time Delhi High Court Case Information System</p>
          <div className="flex justify-center gap-2 mt-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Live Data
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Real-time Scraping
            </Badge>
          </div>
        </div>

        {/* Search Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Case Search
            </CardTitle>
            <CardDescription>
              Enter any case details to fetch real-time information from Delhi High Court records
            </CardDescription>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <h4 className="font-medium text-green-900 mb-2">🔄 Real-time Data Fetching</h4>
              <div className="text-sm text-green-800 space-y-1">
                <p>• Enter any case number (e.g., 1, 55, 12345, etc.)</p>
                <p>• System will fetch live data from Delhi High Court</p>
                <p>• Works with any valid case type and filing year</p>
                <p>• Example: Civil Suit 1 of 2025, Writ 55 of 2024</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="caseType">Case Type *</Label>
                  <Select
                    value={formData.caseType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, caseType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select case type" />
                    </SelectTrigger>
                    <SelectContent>
                      {caseTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caseNumber">Case Number *</Label>
                  <Input
                    id="caseNumber"
                    type="text"
                    placeholder="e.g., 1, 55, 12345"
                    value={formData.caseNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, caseNumber: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">Enter any numeric case number</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filingYear">Filing Year *</Label>
                  <Input
                    id="filingYear"
                    type="number"
                    min="2000"
                    max={new Date().getFullYear()}
                    value={formData.filingYear}
                    onChange={(e) => setFormData((prev) => ({ ...prev, filingYear: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">2000 - {new Date().getFullYear()}</p>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching Live Data from Court...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Fetch Case Data
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Case Data Display */}
        {caseData && (
          <div className="space-y-6">
            {/* Data Source Info */}
            <Card className="shadow-lg border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Data fetched from: {caseData.source || "Delhi High Court"}
                    </span>
                  </div>
                  {caseData.scrapedAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">
                        Scraped: {new Date(caseData.scrapedAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Case Overview */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Case Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Case Number</Label>
                    <p className="text-lg font-semibold">{caseData.caseNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Case Type</Label>
                    <p className="text-lg">{caseData.caseType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Filing Year</Label>
                    <p className="text-lg">{caseData.filingYear}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <Badge variant={caseData.status === "Active" ? "default" : "secondary"}>{caseData.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parties Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Parties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Petitioner</Label>
                    <p className="text-lg">{caseData.parties.petitioner}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Respondent</Label>
                    <p className="text-lg">{caseData.parties.respondent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Dates */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Filing Date</Label>
                    <p className="text-lg">{caseData.filingDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Next Hearing</Label>
                    <p className="text-lg font-semibold text-blue-600">{caseData.nextHearingDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders and Judgments */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Orders & Judgments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseData.orders.map((order, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{order.date}</p>
                          <p className="text-gray-600 mt-1">{order.description}</p>
                        </div>
                        {order.pdfUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadPDF(order.pdfUrl!, `order_${order.date.replace(/\//g, "_")}.pdf`)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download PDF
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Last Updated */}
            <div className="text-center text-sm text-gray-500">Last updated: {caseData.lastUpdated}</div>
          </div>
        )}
      </div>
    </div>
  )
}
