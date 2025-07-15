import { useState } from "react";
import { Brain, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuestionnaireData {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

export default function QuestionnaireSection() {
  const [showHelp, setShowHelp] = useState(true);
  const [answers, setAnswers] = useState<QuestionnaireData>({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
  });
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const { toast } = useToast();

  const questionnaireData = [
    {
      id: "q1",
      question: "What describes your academic strength best?",
      options: [
        { value: "science", label: "Problem-solving and analytical thinking" },
        { value: "english", label: "Creative writing and language skills" },
      ],
    },
    {
      id: "q2",
      question: "Which activity do you enjoy more?",
      options: [
        { value: "science", label: "Conducting experiments and calculations" },
        { value: "english", label: "Reading literature and writing essays" },
      ],
    },
    {
      id: "q3",
      question: "Your career aspiration is more towards:",
      options: [
        { value: "science", label: "Engineering, Medicine, or Research" },
        { value: "english", label: "Literature, Journalism, or Communications" },
      ],
    },
    {
      id: "q4",
      question: "Which best describes your learning style?",
      options: [
        { value: "science", label: "Logical, step-by-step approach" },
        { value: "english", label: "Interpretive and creative thinking" },
      ],
    },
  ];

  const submitMutation = useMutation({
    mutationFn: async (data: QuestionnaireData & { recommendation: string; timestamp: string }) => {
      const response = await apiRequest("POST", "/api/questionnaire", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your questionnaire response has been recorded.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit questionnaire. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const getRecommendation = () => {
    const allAnswered = Object.values(answers).every(answer => answer !== "");
    
    if (!allAnswered) {
      toast({
        title: "Incomplete",
        description: "Please answer all questions to get a recommendation.",
        variant: "destructive",
      });
      return;
    }

    const scienceCount = Object.values(answers).filter(answer => answer === "science").length;
    const englishCount = Object.values(answers).filter(answer => answer === "english").length;

    let recommendationText = "";
    if (scienceCount > englishCount) {
      recommendationText = "🔬 Science Examination - Based on your answers, you have a strong analytical mindset and problem-solving approach. The Science examination would be an excellent fit for your skills and interests. Focus on Physics, Chemistry, Mathematics, and Biology preparation.";
    } else if (englishCount > scienceCount) {
      recommendationText = "✍️ English Examination - Your responses indicate excellent language skills and creative thinking abilities. The English examination would suit your strengths perfectly. Focus on comprehension, grammar, vocabulary, and writing skills.";
    } else {
      recommendationText = "🤔 It's a tie! - You have balanced strengths in both areas. Consider your career goals and which subject you feel more confident about. You can also retake this quiz or consult with your teachers for additional guidance.";
    }

    setRecommendation(recommendationText);

    // Submit to backend
    submitMutation.mutate({
      ...answers,
      recommendation: recommendationText,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <section id="questionnaire" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {showHelp && (
            <div className="bg-accent/20 border border-accent/30 rounded-lg p-4 mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className="h-6 w-6 text-accent" />
                <span className="text-accent font-medium">Need help deciding between Science and English?</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelp(false)}
                className="text-accent hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-bold text-accent">
                Subject Selection Assistant
              </CardTitle>
              <p className="text-lg text-gray-300">
                Answer these questions to help determine which subject suits you best!
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {questionnaireData.map((question, index) => (
                <Card key={question.id} className="bg-white/5 border-white/10">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">
                      {index + 1}. {question.question}
                    </h3>
                    <RadioGroup
                      value={answers[question.id as keyof QuestionnaireData]}
                      onValueChange={(value) => handleAnswerChange(question.id, value)}
                    >
                      {question.options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 p-2 rounded hover:bg-white/10">
                          <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                          <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              ))}

              <Button
                onClick={getRecommendation}
                disabled={submitMutation.isPending}
                className="w-full bg-gradient-to-r from-accent to-brand-red text-white py-4 px-8 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                {submitMutation.isPending ? "Processing..." : "Get My Recommendation"}
              </Button>

              {recommendation && (
                <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-6 w-6 text-accent" />
                      <h3 className="text-xl font-bold text-accent">Your Recommendation:</h3>
                    </div>
                    <p className="text-lg text-white">{recommendation}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
