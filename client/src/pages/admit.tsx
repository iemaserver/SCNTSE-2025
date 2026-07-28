import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Download, CheckCircle, AlertCircle, ArrowLeft, Lock } from "lucide-react";
import { Link } from "wouter";

interface CandidateResult {
  name: string;
  hall_ticket: string;
  downloadToken: string;
}

export default function AdmitCardPage() {
  const [email, setEmail] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [candidate, setCandidate] = useState<CandidateResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCandidate(null);
    setLoading(true);

    const inputEmail = email.trim();
    const inputAadhar = aadhar.trim();

    if (!inputEmail) {
      setError("Please enter your registered Email ID.");
      setLoading(false);
      return;
    }

    if (!inputAadhar) {
      setError("Please enter your Aadhar Number.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inputEmail, aadhar: inputAadhar }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setCandidate({
          name: data.name,
          hall_ticket: data.hall_ticket,
          downloadToken: data.downloadToken,
        });
      } else {
        setError(data.message || `Error ${res.status}: Invalid Email ID or Aadhar Number.`);
      }
    } catch (err: any) {
      console.error("Admit card request error:", err);
      setError("Unable to connect to server. Please check your network or server status and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent mb-3">
            Download SCNTSE 2026 Admit Card
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            Secure verification portal. Enter your registered Email ID and 12-digit Aadhar Number to retrieve your Admit Card.
          </p>
        </div>

        {/* Search Card */}
        <Card className="max-w-xl mx-auto bg-slate-900/90 border-slate-700/80 backdrop-blur-md shadow-2xl rounded-2xl p-6 sm:p-8">
          <CardContent className="p-0">
            {candidate ? (
              <div className="text-center space-y-6 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle className="w-10 h-10" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{candidate.name}</h3>
                  <p className="text-slate-300 text-sm">Hall Ticket Number: <span className="text-amber-400 font-mono font-semibold">{candidate.hall_ticket}</span></p>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-xl text-center text-xs text-slate-400 border border-slate-700 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" /> Verified directly against official examination records.
                </div>

                <div className="pt-2 space-y-3">
                  <a
                    href={`/api/download-admit?token=${candidate.downloadToken}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button className="w-full h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold text-base shadow-lg transition-all gap-2">
                      <Download className="w-5 h-5" /> Download Admit Card PDF
                    </Button>
                  </a>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCandidate(null);
                      setEmail("");
                      setAadhar("");
                    }}
                    className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Search Another Candidate
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Registered Email ID <span className="text-amber-400">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="e.g. candidate@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 h-12 rounded-xl focus:border-amber-400 focus:ring-amber-400"
                  />
                  <p className="text-xs text-slate-400 mt-1">Must match the email ID entered during registration.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Aadhar Card Number <span className="text-amber-400">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. 1234 5678 9012"
                    value={aadhar}
                    onChange={(e) => setAadhar(e.target.value)}
                    required
                    className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 h-12 rounded-xl focus:border-amber-400 focus:ring-amber-400 font-mono"
                  />
                  <p className="text-xs text-slate-400 mt-1">Enter your 12-digit Aadhar card number.</p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold text-base shadow-lg transition-all gap-2"
                >
                  {loading ? (
                    "Verifying Credentials..."
                  ) : (
                    <>
                      <Search className="w-5 h-5" /> Verify & Download Admit Card
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Admit Card Instructions Section */}
        <div className="mt-12 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-4">Admit Card Instructions</h2>
          <ul className="space-y-3 text-slate-300 text-sm sm:text-base list-disc pl-5">
            <li>This admit card shall be considered valid only upon the candidate's fulfillment of all eligibility criteria, including qualifying marks, year of passing Class 12, and successful completion of payment.</li>
            <li>The round 1 examination will be held from 11:00 AM to 1:00 PM, and candidates must report by 10:00 AM as entry will close strictly at 10:30 AM. No student is allowed to leave the exam hall before 1:00 PM.</li>
            <li>Bring the original SCNTSE-2026 Admit Card and a valid original photo ID (Aadhaar/PAN/Passport/School ID).</li>
            <li>Carry one passport size colour photograph (same as uploaded during application).</li>
            <li>Candidates are strictly instructed not to adopt any unfair means or malpractices and not to misbehave with the examination officials during the examination. Candidates must adhere to all the examination rules and regulations regarding their conduct in the Examination Hall. All cases of unfair means will lead to cancellation of examination of the concerned candidate.</li>
            <li>Decision of the Exam coordinators are final in all regards.</li>
            <li>Use only the blue/black ballpoint pen for filling the OMR sheet. Do not use any whitener, gel pen, correction fluid, or pencils.</li>
            <li>Submit your OMR sheet and the question booklet before leaving.</li>
            <li>Usage of calculators, electronic devices such as mobile phones, digital watch, fitness band, headphones and similar devices are strictly not allowed inside the examination hall.</li>
          </ul>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <h3 className="text-base font-semibold text-slate-200 mb-2">Center Codes & Venues:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
              <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <span className="font-bold text-amber-400">Center Code 02:</span> IEM Management House (Bidhannagar, Kolkata)
              </div>
              <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <span className="font-bold text-amber-400">Center Code 04:</span> IEM Newtown (Action Area III, Kolkata)
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
