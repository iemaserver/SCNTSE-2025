import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function AdmitCardPage() {
  const [email, setEmail] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [admitUrl, setAdmitUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdmitUrl(null);
    setLoading(true);
    try {
      // Replace with your actual Vercel deployment URL
      const VERCEL_API_URL = "https://api-server-mauve.vercel.app/api/admit";
      const res = await fetch(VERCEL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, parentEmail })
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setAdmitUrl(data.url);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 min-h-[60vh] bg-gradient-to-br from-accent/10 to-white/10">
      <div className="flex flex-col items-center justify-center w-full">
        <Card className="max-w-md w-full mx-auto p-6 rounded-xl shadow-lg bg-white/10 border border-accent/30">
          <h2 className="text-3xl font-bold text-accent mb-6 text-center">Download Admit Card</h2>
          {admitUrl ? (
            <CardContent className="text-center">
              <p className="mb-4 text-lg text-white">Login successful!</p>
              <a href={admitUrl} target="_blank" rel="noopener noreferrer">
                <Button className="w-full">Download Admit Card</Button>
              </a>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white mb-1 font-medium">Username (Your Email)</label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  className="bg-white/20 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-1 font-medium">Password (Your Parent's Email)</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={parentEmail}
                    onChange={e => setParentEmail(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="bg-white/20 text-white pr-10"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-accent hover:text-accent/80 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {error && <div className="text-red-400 text-sm text-center">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Checking..." : "Login & Download"}
              </Button>
            </form>
          )}
        </Card>
        {/* Admit Card Instructions - Always Below Card */}
        <section
          className="max-w-2xl w-full mx-auto mt-8 mb-4 px-4 sm:px-6 py-6 bg-gradient-to-br from-accent/10 to-white/20 border-l-4 border-accent rounded-xl shadow-lg"
          style={{ backdropFilter: 'blur(2px)' }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-accent mb-4 text-left">Important Instructions</h3>
          <ul className="list-disc pl-5 sm:pl-8 text-white/90 space-y-2 text-sm sm:text-base">
            <li>This admit card shall be considered valid only upon the candidate's fulfillment of all eligibility criteria, including qualifying marks, year of passing Class 12, and successful completion of payment.</li>
            <li>The round 1 examination will be held from 11:00 AM to 1:00 PM, and candidates must report by 10:00 AM as entry will close strictly at 10:30 AM. No student is allowed to leave the exam hall before 1:00 PM.</li>
            <li>Bring the original SCNTSE-2025 Admit Card and a valid original photo ID (Aadhaar/PAN/Passport/School ID).</li>
            <li>Carry one passport size colour photograph (same as uploaded during application).</li>
            <li>Candidates are strictly instructed not to adopt any unfair means or malpractices and not to misbehave with the examination officials during the examination. Candidates must adhere to all the examination rules and regulations regarding their conduct in the Examination Hall. All cases of unfair means will lead to cancellation of examination of the concerned candidate.</li>
            <li>Use only the blue/black ballpoint pen for filling the OMR sheet. Do not use any whitener, gel pen, correction fluid, or pencils.</li>
            <li>Usage of calculators, electronic devices such as mobile phones, digital watch, fitness band, headphones and similar devices are strictly not allowed inside the examination hall.</li>
            <li>Submit both OMR sheet and question booklet to the invigilator before leaving the examination hall.</li>
            <li>No extra OMR sheet will be provided to the candidates under any circumstances.</li>
            <li>Decision of the Exam coordinators are final in all regards.</li>
          </ul>
          <h4 className="text-lg sm:text-xl font-semibold text-accent mt-8 mb-2">Disclaimer</h4>
          <p className="text-white/80 text-xs sm:text-sm mb-6 leading-relaxed">
            The Admit Card has been issued based on the information provided by the candidate, which is presumed to fulfill all eligibility criteria as per the examination guidelines. However, if at any stage of the examination process it is found that the candidate has furnished false, incorrect, or misleading information, the Admit Card will be deemed invalid, and the candidature will be cancelled immediately. This cancellation may occur at any stage — before, during, or after the examination — without any further notice.
          </p>
          <h4 className="text-lg sm:text-xl font-semibold text-accent mb-2">Possible Reasons You Are Unable to Download the Admit Card</h4>
          <ul className="list-disc pl-5 sm:pl-8 text-white/90 space-y-1 text-sm sm:text-base">
            <li><span className="font-semibold text-accent">Entered Username</span> HAS TO BE SAME AS THE EMAIL ENTERED IN THE FORM</li>
            <li><span className="font-semibold text-accent">Entered PASSWORD</span> HAS TO BE SAME AS THE PARENT'S EMAIL ENTERED IN THE FORM</li>
            <li><span className="font-semibold text-accent">The candidate was Ineligible</span> (2023 or 2024 passouts)</li>
          </ul>
        </section>
      </div>
    </section>
  );
}
