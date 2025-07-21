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
    <section className="py-20 min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-accent/10 to-white/10">
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
    </section>
  );
}
