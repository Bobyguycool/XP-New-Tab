"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad2, Trophy, Clock, RefreshCw } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
  image?: string
}

interface QuizResult {
  date: string
  score: number
  totalQuestions: number
  timeSpent: number
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Which Nintendo console was released in 1996?",
    options: ["Super Nintendo", "Nintendo 64", "GameCube", "Wii"],
    correctAnswer: 1,
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    id: 2,
    text: "Who is the main protagonist in The Legend of Zelda series?",
    options: ["Zelda", "Link", "Ganon", "Mario"],
    correctAnswer: 1,
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    id: 3,
    text: "Which of these is NOT one of the original 151 Pokémon?",
    options: ["Pikachu", "Charizard", "Lucario", "Mewtwo"],
    correctAnswer: 2,
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    id: 4,
    text: "What was the first home video game console?",
    options: ["Atari 2600", "Magnavox Odyssey", "Nintendo Entertainment System", "Intellivision"],
    correctAnswer: 1,
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    id: 5,
    text: "Which company created the PlayStation?",
    options: ["Nintendo", "Microsoft", "Sony", "Sega"],
    correctAnswer: 2,
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    id: 6,
    text: "What year was the original Super Mario Bros. released?",
    options: ["1983", "1985", "1987", "1989"],
    correctAnswer: 1,
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    id: 7,
    text: "Which of these games was NOT made by Nintendo?",
    options: ["Metroid", "Sonic the Hedgehog", "Star Fox", "Donkey Kong"],
    correctAnswer: 1,
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    id: 8,
    text: "What was Sega's last home console?",
    options: ["Genesis", "Saturn", "Dreamcast", "Master System"],
    correctAnswer: 2,
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    id: 9,
    text: "Which of these characters is from the Final Fantasy series?",
    options: ["Master Chief", "Cloud Strife", "Solid Snake", "Gordon Freeman"],
    correctAnswer: 1,
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    id: 10,
    text: "What was the best-selling game console of all time?",
    options: ["PlayStation 2", "Nintendo DS", "Game Boy", "Wii"],
    correctAnswer: 0,
    image: "/placeholder.svg?height=150&width=200",
  },
]

export default function RetroGameQuiz() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizStartTime, setQuizStartTime] = useState(0)
  const [quizResults, setQuizResults] = useLocalStorage<QuizResult[]>("retro-quiz-results", [])
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])

  // Shuffle questions when starting a new quiz
  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      // Shuffle the questions
      const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5)
      setShuffledQuestions(shuffled)
      setQuizStartTime(Date.now())
    }
  }, [quizStarted, quizCompleted])

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (quizStarted && !quizCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && !quizCompleted) {
      // Time's up, move to next question or end quiz
      handleNextQuestion()
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [quizStarted, quizCompleted, timeLeft])

  const startQuiz = () => {
    setQuizStarted(true)
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
    setScore(0)
    setTimeLeft(30)
    setSelectedAnswer(null)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return // Prevent changing answer

    setSelectedAnswer(answerIndex)

    // Check if answer is correct
    const currentQuestion = shuffledQuestions[currentQuestionIndex]
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1)
    }

    // Move to next question after a short delay
    setTimeout(() => {
      handleNextQuestion()
    }, 1500)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setTimeLeft(30) // Reset timer for next question
    } else {
      // Quiz completed
      const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000)
      const result: QuizResult = {
        date: new Date().toISOString(),
        score,
        totalQuestions: shuffledQuestions.length,
        timeSpent,
      }

      setQuizResults([...quizResults, result])
      setQuizCompleted(true)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Retro Gaming Quiz
          </div>
          {quizStarted && !quizCompleted && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>{timeLeft}s</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!quizStarted ? (
          <div className="text-center py-8">
            <h3 className="text-xl font-bold mb-4">Test Your Retro Gaming Knowledge!</h3>
            <p className="mb-6 text-muted-foreground">
              5 random questions • 30 seconds per question • How many can you get right?
            </p>
            <Button onClick={startQuiz} size="lg">
              Start Quiz
            </Button>

            {quizResults.length > 0 && (
              <div className="mt-8">
                <h4 className="font-medium mb-2">Previous Results</h4>
                <div className="space-y-2">
                  {quizResults
                    .slice(-3)
                    .reverse()
                    .map((result, index) => (
                      <div key={index} className="flex justify-between text-sm p-2 bg-muted/30 rounded-md">
                        <span>{new Date(result.date).toLocaleDateString()}</span>
                        <span className="font-medium">
                          {result.score}/{result.totalQuestions} (
                          {Math.round((result.score / result.totalQuestions) * 100)}%)
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : quizCompleted ? (
          <div className="text-center py-8">
            <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
            <p className="text-xl mb-6">
              Your Score: {score}/{shuffledQuestions.length} ({Math.round((score / shuffledQuestions.length) * 100)}%)
            </p>
            <Button onClick={startQuiz} className="mr-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
              </span>
              <span>Score: {score}</span>
            </div>

            {shuffledQuestions.length > 0 && (
              <>
                <div className="text-center mb-4">
                  <h3 className="text-xl font-medium mb-4">{shuffledQuestions[currentQuestionIndex].text}</h3>
                  {shuffledQuestions[currentQuestionIndex].image && (
                    <img
                      src={shuffledQuestions[currentQuestionIndex].image || "/placeholder.svg"}
                      alt="Question"
                      className="mx-auto mb-4 rounded-md"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {shuffledQuestions[currentQuestionIndex].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedAnswer === null
                          ? "outline"
                          : selectedAnswer === index
                            ? index === shuffledQuestions[currentQuestionIndex].correctAnswer
                              ? "default"
                              : "destructive"
                            : index === shuffledQuestions[currentQuestionIndex].correctAnswer
                              ? "default"
                              : "outline"
                      }
                      className={
                        selectedAnswer !== null && index === shuffledQuestions[currentQuestionIndex].correctAnswer
                          ? "border-green-500 bg-green-100 dark:bg-green-900/30"
                          : ""
                      }
                      onClick={() => handleAnswerSelect(index)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
