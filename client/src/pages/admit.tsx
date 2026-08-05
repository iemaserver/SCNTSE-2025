import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Download, CheckCircle, AlertCircle, ArrowLeft, Lock } from "lucide-react";
import { Link } from "wouter";

interface CandidateResult {
  name: string;
  hall_ticket: string;
  pdfUrl: string;
}

type Round = "r1" | "r2";

async function sha256Hash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function lookupCandidate(
  email: string,
  aadhar: string,
  round: Round
): Promise<CandidateResult | null> {
  const hashKey = await sha256Hash(`${email}:${aadhar}`);
  const dbFile = round === "r1" ? "/admit-db.json" : "/admit_round2_db.json";

  try {
    const dbRes = await fetch(dbFile);
    if (!dbRes.ok) return null;
    const dbData = await dbRes.json();
    const matched = dbData[hashKey];
    if (matched) {
      return {
        name: matched.name,
        hall_ticket: matched.ht,
        pdfUrl: matched.pdf || (round === "r1" ? `/admit/${matched.aadhar}.pdf` : `/admit_round2/${matched.ht}_r2.pdf`),
      };
    }
  } catch (err) {
    console.error("DB lookup error:", err);
  }

  // Round 1 also tries the API server as fallback
  if (round === "r1") {
    try {
      const res = await fetch("/api/admit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, aadhar }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success) {
          return {
            name: data.name,
            hall_ticket: data.hall_ticket,
            pdfUrl: `/api/download-admit?token=${data.downloadToken}`,
          };
        }
      }
    } catch {
      // ignore
    }
  }

  return null;
}

export default function AdmitCardPage() {
  const [round, setRound] = useState<Round>("r2");
  const [email, setEmail] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [candidate, setCandidate] = useState<CandidateResult | null>(null);

  const switchRound = (r: Round) => {
    setRound(r);
    setCandidate(null);
    setError("");
    setEmail("");
    setAadhar("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCandidate(null);
    setLoading(true);

    const inputEmail = email.trim().toLowerCase();
    const inputAadhar = aadhar.trim().replace(/[^\d]/g, "");

    if (!inputEmail) {
      setError("Please enter your registered Email ID.");
      setLoading(false);
      return;
    }
    if (!inputAadhar) {
      setError("Please enter your 12-digit Aadhar Card Number.");
      setLoading(false);
      return;
    }

    const result = await lookupCandidate(inputEmail, inputAadhar, round);

    if (result) {
      setCandidate(result);
    } else {
      setError(
        round === "r2"
          ? "No Round 2 admit card found. Either you did not qualify Round 1, or your credentials do not match. Please check and try again."
          : "No candidate found matching the provided Email ID and Aadhar Number. Please check your credentials and try again."
      );
    }

    setLoading(false);
  };

  const isR2 = round === "r2";

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
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent mb-3">
            SCNTSE 2026 Admit Card
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            Enter your registered Email ID and 12-digit Aadhar Number to download your admit card.
          </p>
        </div>

        {/* Round Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl border border-slate-700 overflow-hidden shadow-lg">
            <button
              onClick={() => switchRound("r1")}
              className={`px-6 py-3 text-sm font-bold transition-all duration-200 ${
                !isR2
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              Round 1 Admit Card
            </button>
            <button
              onClick={() => switchRound("r2")}
              className={`px-6 py-3 text-sm font-bold transition-all duration-200 ${
                isR2
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              Round 2 Admit Card
            </button>
          </div>
        </div>

        {/* Round 2 notice banner */}
        {isR2 && (
          <div className="max-w-xl mx-auto mb-6 px-4 py-3 rounded-xl bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 text-sm text-center">
            🎉 Round 2 admit cards are available for qualified Round 1 candidates only.
            <br />
            <span className="text-emerald-400 font-semibold">Exam Date: 9th August 2026 (Sunday) · 10:30 AM – 1:30 PM</span>
          </div>
        )}

        {/* Search Card */}
        <Card className="max-w-xl mx-auto bg-slate-900/90 border-slate-700/80 backdrop-blur-md shadow-2xl rounded-2xl p-6 sm:p-8">
          <CardContent className="p-0">
            {candidate ? (
              <div className="text-center space-y-6 animate-fade-in">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${isR2 ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400" : "bg-amber-500/20 border border-amber-500/40 text-amber-400"}`}>
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{candidate.name}</h3>
                  <p className="text-slate-300 text-sm">
                    Hall Ticket Number:{" "}
                    <span className={`font-mono font-semibold ${isR2 ? "text-emerald-400" : "text-amber-400"}`}>
                      {candidate.hall_ticket}
                    </span>
                  </p>
                  {isR2 && (
                    <p className="text-emerald-300 text-xs mt-1 font-medium">
                      ✓ Qualified for Round 2 · Venue: IEM Management House
                    </p>
                  )}
                </div>

                <div className="bg-slate-800/60 p-4 rounded-xl text-center text-xs text-slate-400 border border-slate-700 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" /> Verified against official examination records.
                </div>

                <div className="pt-2 space-y-3">
                  <a
                    href={candidate.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button className={`w-full h-12 font-bold text-base shadow-lg transition-all gap-2 ${isR2 ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white" : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950"}`}>
                      <Download className="w-5 h-5" />
                      Download {isR2 ? "Round 2" : "Round 1"} Admit Card PDF
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
                  className={`w-full h-12 font-bold text-base shadow-lg transition-all gap-2 ${isR2 ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white" : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950"}`}
                >
                  {loading ? (
                    "Verifying Credentials..."
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Verify & Download {isR2 ? "Round 2" : "Round 1"} Admit Card
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mt-12 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-4">
            {isR2 ? "Round 2 Instructions" : "Round 1 Instructions"}
          </h2>

          {isR2 ? (
            <ul className="space-y-3 text-slate-300 text-sm sm:text-base list-disc pl-5">
              <li>This admit card is valid only upon fulfillment of all Round 1 qualification criteria as declared by the examination committee.</li>
              <li>Candidates must report to the examination hall by <strong className="text-white">10:00 AM</strong>. Entry closes strictly at <strong className="text-white">10:15 AM</strong>. Examination begins at <strong className="text-white">10:30 AM</strong>.</li>
              <li>Bring the original SCNTSE 2026 Round 2 Admit Card and a valid original photo ID (Aadhaar / PAN / Passport / School ID).</li>
              <li>Carry one passport-size colour photograph (same as uploaded during application).</li>
              <li>The examination is of <strong className="text-white">100 marks</strong>. The Question Booklet consists of 7 questions each from Physics, Chemistry, Mathematics, and English. Candidates may attempt any 5 questions from each subject (5 marks each).</li>
              <li>On completion, the candidate must hand over the <strong className="text-white">answer scripts AND the question booklet</strong> to the Invigilator before leaving the hall. No candidate is permitted to leave early.</li>
              <li>Usage of calculators, mobile phones, digital watches, fitness bands, headphones, and similar devices is <strong className="text-white">strictly prohibited</strong> inside the examination hall.</li>
              <li>Candidates are strictly instructed not to adopt any unfair means or malpractices. All cases of unfair means will lead to immediate cancellation of the candidature.</li>
              <li>Decision of the Exam Coordinators is final in all regards.</li>
            </ul>
          ) : (
            <ul className="space-y-3 text-slate-300 text-sm sm:text-base list-disc pl-5">
              <li>This admit card shall be considered valid only upon the candidate's fulfillment of all eligibility criteria, including qualifying marks, year of passing Class 12, and successful completion of payment.</li>
              <li>The round 1 examination will be held from 11:00 AM to 1:00 PM, and candidates must report by 10:00 AM as entry will close strictly at 10:30 AM. No student is allowed to leave the exam hall before 1:00 PM.</li>
              <li>Bring the original SCNTSE-2026 Admit Card and a valid original photo ID (Aadhaar/PAN/Passport/School ID).</li>
              <li>Carry one passport size colour photograph (same as uploaded during application).</li>
              <li>Candidates are strictly instructed not to adopt any unfair means or malpractices and not to misbehave with the examination officials during the examination. All cases of unfair means will lead to cancellation of examination of the concerned candidate.</li>
              <li>Decision of the Exam coordinators are final in all regards.</li>
              <li>Use only the blue/black ballpoint pen for filling the OMR sheet. Do not use any whitener, gel pen, correction fluid, or pencils.</li>
              <li>Submit your OMR sheet and the question booklet before leaving.</li>
              <li>Usage of calculators, electronic devices such as mobile phones, digital watch, fitness band, headphones and similar devices are strictly not allowed inside the examination hall.</li>
            </ul>
          )}

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
