"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, Gift } from "lucide-react"

interface Question {
  q: string
  options: string[]
  answer: number
}

interface FallingCoin {
  id: number
  left: number
  duration: number
}

export default function RewardsPage() {
  const [coins, setCoins] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showRedeem, setShowRedeem] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [fallingCoins, setFallingCoins] = useState<FallingCoin[]>([])

  const questions: Question[] = [
    { 
      q: "Which of the following best defines 'Emergency Fund'?", 
      options: ["Money for vacations", "Money for unexpected expenses", "Investment in mutual funds", "A short-term loan"], 
      answer: 1 
    },
    { 
      q: "What does 'DTI (Debt-to-Income)' ratio measure?", 
      options: ["Income  Rent", "EMI  Monthly income", "Savings  Expenses", "Investments  Liabilities"], 
      answer: 1 
    },
    { 
      q: "SIP (Systematic Investment Plan) is primarily used in:", 
      options: ["Real Estate", "Mutual Funds", "Gold Bonds", "Insurance"], 
      answer: 1 
    },
    { 
      q: "What does 'Diversification' in investing mean?", 
      options: ["Investing all money in one stock", "Investing in different assets", "Keeping money in FD", "Selling assets quickly"], 
      answer: 1 
    },
    { 
      q: "What is the recommended size of an emergency fund?", 
      options: ["1 month of expenses", "3–6 months of expenses", "12 months of expenses", "No savings needed"], 
      answer: 1 
    },
    { 
      q: "Which investment is typically considered inflation-beating in the long run?", 
      options: ["Equity/Stocks", "Savings Account", "Fixed Deposit", "Gold Jewelry"], 
      answer: 0 
    },
    { 
      q: "What does 'compound interest' mean?", 
      options: ["Interest only on principal", "Interest on both principal and accumulated interest", "Fixed return per year", "Penalty for delayed payments"], 
      answer: 1 
    },
    { 
      q: "What is a credit score primarily used for?", 
      options: ["Determining income tax", "Assessing loan/creditworthiness", "Measuring savings rate", "Calculating insurance premium"], 
      answer: 1 
    },
    { 
      q: "What does 'liquidity' of an asset mean?", 
      options: ["How risky the asset is", "How easily it can be converted to cash", "How much return it gives", "How long it is locked in"], 
      answer: 1 
    },
    { 
      q: "Which is an example of a tax-saving investment under Section 80C in India?", 
      options: ["Mutual Funds (ELSS)", "Credit Card Payments", "Fixed Deposit (<1 yr)", "Buying Gold"], 
      answer: 0 
    },
    { 
      q: "What is the main advantage of UPI (Unified Payments Interface)?", 
      options: ["High interest on savings", "Instant, real-time money transfers", "Tax-free income", "Foreign currency exchange"], 
      answer: 1 
    },
    { 
      q: "What does 'inflation' mean?", 
      options: ["Increase in product quality", "General increase in prices over time", "Decrease in supply of money", "Increase in employment rates"], 
      answer: 1 
    },
    { 
      q: "In mutual funds, 'NAV' stands for:", 
      options: ["Net Annual Value", "Net Asset Value", "New Account Value", "Nominal Asset Value"], 
      answer: 1 
    },
    { 
      q: "What is the benefit of having health insurance?", 
      options: ["Increases your salary", "Provides protection against medical expenses", "Helps you save tax only", "Guarantees free medicines"], 
      answer: 1 
    }
  ]

  const offers = [
    "Bgsc.png",
    "Bgsc 1.png", 
    "Bgsc2.png",
    "Bgsc 3.png"
  ]

  useEffect(() => {
    // Load coins from localStorage
    const savedCoins = parseInt(localStorage.getItem("miroCoins") || "0")
    setCoins(savedCoins)
    
    // Show quiz on page load
    showRandomQuiz()
    
    // Show quiz every 15 minutes
    const interval = setInterval(showRandomQuiz, 900000)
    return () => clearInterval(interval)
  }, [])

  const showRandomQuiz = () => {
    const randomQ = questions[Math.floor(Math.random() * questions.length)]
    setCurrentQuestion(randomQ)
    setShowQuiz(true)
    setSelectedAnswer(null)
    setShowAnswer(false)
  }

  const handleAnswer = (index: number) => {
    if (showAnswer) return
    
    setSelectedAnswer(index)
    setShowAnswer(true)
    
    if (index === currentQuestion?.answer) {
      addCoins(5)
    }
  }

  const addCoins = (amount: number) => {
    const newCoins = coins + amount
    setCoins(newCoins)
    localStorage.setItem("miroCoins", newCoins.toString())
    
    // Create falling coins animation
    for (let i = 0; i < 15; i++) {
      createFallingCoin()
    }
  }

  const createFallingCoin = () => {
    const coin: FallingCoin = {
      id: Date.now() + Math.random(),
      left: Math.random() * 100,
      duration: 1.5 + Math.random() * 1.5
    }
    setFallingCoins(prev => [...prev, coin])
    
    setTimeout(() => {
      setFallingCoins(prev => prev.filter(c => c.id !== coin.id))
    }, 3000)
  }

  const handleRedeem = () => {
    if (coins >= 10) {
      setCoins(prev => prev - 10)
      localStorage.setItem("miroCoins", (coins - 10).toString())
      setShowRedeem(true)
    } else {
      alert("You need at least 10 MIRO Coins to redeem!")
    }
  }

  const getAnswerClass = (index: number) => {
    if (!showAnswer) return "text-black"
    if (index === currentQuestion?.answer) return "bg-green-100 border-green-500 text-green-700"
    if (index === selectedAnswer && index !== currentQuestion?.answer) return "bg-red-100 border-red-500 text-red-700"
    return "text-black"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Wallet */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={handleRedeem}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-lg flex items-center gap-2"
        >
          <Coins className="h-6 w-6" />
          MIRO Coins: {coins}
        </Button>
      </motion.div>

      {/* Falling Coins */}
      <AnimatePresence>
        {fallingCoins.map((coin) => (
          <motion.div
            key={coin.id}
            className="fixed top-0 w-10 h-10 z-40"
            style={{ left: `${coin.left}%` }}
            initial={{ y: -50, opacity: 1 }}
            animate={{ y: "100vh", opacity: 0 }}
            transition={{ duration: coin.duration, ease: "linear" }}
          >
            <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center text-2xl">
              
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Quiz Popup */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowQuiz(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <img 
                    src="/MIRO.png" 
                    alt="Miro Avatar" 
                    className="w-24 h-24 rounded-full border-4 border-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {currentQuestion?.q}
                  </h3>
                  <div className="space-y-3">
                    {currentQuestion?.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className={`w-full p-4 text-left border-2 rounded-xl transition-all hover:bg-gray-50 ${getAnswerClass(index)}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={() => setShowQuiz(false)}
                    className="mt-6 w-full bg-blue-500 hover:bg-blue-600"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Redeem Section */}
      <AnimatePresence>
        {showRedeem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRedeem(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <Gift className="h-8 w-8 text-purple-500" />
                  Redeem Your Coins
                </h2>
                <p className="text-gray-600">Scratch the cards to reveal your rewards!</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {offers.map((offer, index) => (
                  <ScratchCard key={index} image={offer} />
                ))}
              </div>
              
              <Button
                onClick={() => setShowRedeem(false)}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            MIRO Rewards
          </h1>
          <p className="text-gray-600 text-lg">
            Answer questions to earn coins and redeem exciting rewards!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <CardHeader>
              <Coins className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <CardTitle>Earn Coins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Answer financial questions correctly to earn 5 MIRO coins per question.
              </p>
              <Button onClick={showRandomQuiz} className="w-full">
                Take Quiz Now
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <Gift className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle>Redeem Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Use your coins to scratch cards and reveal amazing rewards and offers.
              </p>
              <Button 
                onClick={handleRedeem} 
                className="w-full"
                disabled={coins < 10}
              >
                Redeem (10 coins)
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <div className="text-4xl mb-4"></div>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                You have earned <span className="font-bold text-yellow-600">{coins}</span> MIRO coins so far!
              </p>
              <div className="text-sm text-gray-500">
                Keep learning to earn more rewards!
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Scratch Card Component
function ScratchCard({ image }: { image: string }) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <motion.div
      className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer ${
        isRevealed ? 'bg-gray-200' : 'bg-gradient-to-br from-gray-400 to-gray-600'
      }`}
      onClick={() => setIsRevealed(true)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {!isRevealed ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-xl">Scratch Me</span>
        </div>
      ) : (
        <img 
          src={`/${image}`} 
          alt="Reward" 
          className="w-full h-full object-cover"
        />
      )}
    </motion.div>
  )
}