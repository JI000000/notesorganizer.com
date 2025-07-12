'use client'

import { useState } from 'react'
import { Sparkles, Lightbulb, CheckCircle, AlertCircle, Users, Clock, FileText, CaseUpper, Zap, Target } from 'lucide-react'

const MAX_DISPLAY_TITLES = 5

const examples = [
  {
    title: "Blog Post",
    description: "Create engaging blog post titles",
    input: `I've been researching the impact of remote work on team productivity and collaboration. After surveying 200+ companies over the past year, I found some surprising results.

The data shows that while individual productivity increased by an average of 23%, team collaboration suffered in unexpected ways. The biggest challenges weren't technology-related as most people assumed, but rather around maintaining company culture and spontaneous innovation.

Key findings include:
- 67% of teams reported difficulty with creative brainstorming sessions
- Employee satisfaction with work-life balance improved by 34%
- Management oversight became more challenging but also more focused
- Cross-department communication decreased by 19%

The most successful remote companies implemented structured "collision time" - scheduled informal interactions that replicate office spontaneity. Companies that didn't adapt their collaboration methods saw a 15% decrease in innovation metrics.`,
    expectedOutput: [
      "The Remote Work Paradox: Why Productivity Soared But Innovation Plummeted",
      "200+ Companies Reveal the Hidden Truth About Remote Work's Impact",
      "Beyond Productivity: How Remote Work Secretly Kills Team Innovation",
      "The Great Remote Work Experiment: What 200 Companies Learned",
      "Remote Work's Dirty Secret: Why Your Team Is More Productive But Less Creative"
    ]
  },
  {
    title: "Research Paper",
    description: "Generate academic paper titles",
    input: `This study investigates the effectiveness of machine learning algorithms in predicting customer churn for subscription-based software services. We analyzed data from 15 SaaS companies over a 3-year period, examining various behavioral indicators and their correlation with customer retention.

Our methodology combines multiple ML approaches including random forests, neural networks, and gradient boosting to identify the most reliable predictors of churn. We also developed a novel feature engineering approach that incorporates temporal patterns in user engagement.

The research reveals that traditional metrics like login frequency are less predictive than previously thought. Instead, patterns in feature adoption and support ticket sentiment show stronger correlation with retention. Our model achieved 89% accuracy in predicting churn 30 days in advance, outperforming existing industry benchmarks by 12%.

This has significant implications for SaaS revenue optimization and customer success strategies.`,
    expectedOutput: [
      "Predicting Customer Churn in SaaS: A Multi-Algorithm Approach to 30-Day Retention Forecasting",
      "Beyond Login Frequency: Novel Behavioral Indicators for SaaS Customer Churn Prediction",
      "Machine Learning for SaaS Retention: Achieving 89% Accuracy in Customer Churn Prediction",
      "Temporal Pattern Analysis in Customer Behavior: A New Framework for SaaS Churn Prevention",
      "Feature Adoption Patterns as Churn Predictors: Evidence from 15 SaaS Companies"
    ]
  },
  {
    title: "Meeting Notes",
    description: "Create clear titles for meeting documentation",
    input: `We discussed the Q1 budget allocation for the marketing department. The main focus was on shifting resources from traditional advertising to digital channels, particularly social media and content marketing.

Sarah presented the performance data from last quarter showing that digital campaigns had 3x better ROI than print advertising. The team agreed to allocate 70% of the budget to digital initiatives.

We also covered the new hiring plan - we need two content creators and one data analyst by March. The content creators will focus on video content for TikTok and Instagram, while the analyst will help optimize our attribution modeling.

Timeline: Budget reallocation by January 15th, job postings by January 20th, interviews in February, new hires start March 1st.`,
    expectedOutput: [
      "Q1 Marketing Budget Meeting: Digital Shift Strategy & Hiring Plan",
      "Marketing Budget Reallocation: 70% Digital Focus & Q1 Staffing",
      "Q1 Planning Session: Marketing Budget & New Hire Timeline",
      "Marketing Department Q1 Strategy: Budget Shift & Team Expansion",
      "Q1 Marketing Planning: Digital Priority & March Hiring Goals"
    ]
  }
];

const tips = [
  {
    icon: FileText,
    title: "Content Length",
    description: "Works best with 100-1000 words. Include key points and context."
  },
  {
    icon: Target,
    title: "Clear Purpose",
    description: "Better results when the content has a clear main topic or goal."
  },
  {
    icon: Sparkles,
    title: "Title Variety",
    description: "Generates 5 different styles: informative, catchy, academic, question-based."
  },
  {
    icon: Clock,
    title: "Quick Generation",
    description: "Titles generated in 2-4 seconds with multiple creative options."
  }
];

const titleTypes = [
  {
    type: "Informative",
    description: "Clear, descriptive titles that summarize the main topic",
    example: "AI-Powered Customer Churn Prediction in SaaS: A 15-Company Study"
  },
  {
    type: "Engaging",
    description: "Catchy, attention-grabbing titles with emotional hooks",
    example: "The $2M Question: Why Your Best Customers Are Secretly Planning to Leave"
  },
  {
    type: "Question-Based",
    description: "Titles that pose intriguing questions to draw readers in",
    example: "Are Your Login Metrics Lying? The Truth About SaaS Churn Prediction"
  },
  {
    type: "Benefit-Focused",
    description: "Titles emphasizing value, results, or solutions",
    example: "How to Predict Customer Churn 30 Days Early (With 89% Accuracy)"
  }
];

export default function TitleGeneratorPage() {
  const [text, setText] = useState('')
  const [titles, setTitles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showExamples, setShowExamples] = useState(false)
  const [selectedExample, setSelectedExample] = useState<number | null>(null)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTitles([])
    setError('')

    const response = await fetch('/api/generate-title', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })

    setIsLoading(false)

    if (!response.ok) {
      const result = await response.json()
      setError(result.error || 'An unexpected error occurred.')
      return
    }

    const result = await response.json()
    setTitles(result.titles)
  }

  const loadExample = (example: typeof examples[0]) => {
    setText(example.input);
    setSelectedExample(examples.indexOf(example));
    setShowExamples(false);
  };

  const copyTitle = (title: string) => {
    navigator.clipboard.writeText(title);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="py-12 bg-gradient-to-br from-purple-600/10 to-pink-600/10 border-b border-gray-800">
        <div className="text-center max-w-4xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-600/20 rounded-2xl border border-purple-500/30">
              <CaseUpper className="w-12 h-12 text-purple-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-100 mb-4">
            AI Title Generator
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Transform your content into compelling, click-worthy titles that capture attention
          </p>
          
          {/* Quick Tips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {tips.map((tip, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
                <tip.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-200 mb-1">{tip.title}</div>
                <div className="text-xs text-gray-400">{tip.description}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* How to Use Section */}
        <div className="mb-8 bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">How to Use</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300">
            <div>
              <div className="font-semibold text-purple-400 mb-2">1. Paste Your Content</div>
              <p>Add your article, blog post, research paper, or meeting notes. Include the main points and key information.</p>
            </div>
            <div>
              <div className="font-semibold text-green-400 mb-2">2. Generate Titles</div>
              <p>Our AI analyzes your content and creates 5 different title styles to choose from.</p>
            </div>
            <div>
              <div className="font-semibold text-blue-400 mb-2">3. Pick & Customize</div>
              <p>Select your favorite title or use it as inspiration to create your own perfect headline.</p>
            </div>
          </div>
        </div>

        {/* Title Types Section */}
        <div className="mb-8 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
            <Zap className="w-6 h-6 text-purple-400" />
            Title Types We Generate
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {titleTypes.map((type, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300 mb-2">{type.type}</h3>
                <p className="text-sm text-gray-400 mb-3">{type.description}</p>
                <div className="text-xs text-gray-500 italic">
                  &quot;{type.example}&quot;
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Examples Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Example Inputs</h2>
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              {showExamples ? 'Hide Examples' : 'Show Examples'}
            </button>
          </div>
          
          {showExamples && (
            <div className="grid gap-4 mb-6">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className={`bg-slate-800/50 border rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-800/70 ${
                    selectedExample === index ? 'border-purple-500' : 'border-slate-700/50'
                  }`}
                  onClick={() => loadExample(example)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{example.title}</h3>
                    <span className="text-xs text-purple-400">Click to load</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{example.description}</p>
                  <div className="text-xs text-gray-500">
                    Input length: ~{example.input.length} characters
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Tool Interface */}
        <div className="grid gap-8">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center justify-between mb-3">
              <label className="text-lg font-semibold text-gray-200">Your Content</label>
              <div className="text-sm text-gray-400">
                {text.length} characters
              </div>
            </div>
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Paste your content here... (articles, blog posts, research papers, meeting notes, etc.)"
              className="w-full h-64 p-4 border border-white/10 bg-white/5 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder:text-gray-500 resize-none"
              disabled={isLoading}
            />
            {error && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-400">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <div className="mt-4 text-center">
              <button
                type="submit"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-500 transition-colors"
                disabled={isLoading || !text.trim()}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Titles...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Titles
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results */}
          {titles.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Your AI-Generated Titles</h2>
              </div>
              <div className="space-y-4">
                {titles.slice(0, MAX_DISPLAY_TITLES).map((title, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:border-purple-500/50 transition-all duration-200">
                      <div className="flex items-start gap-4 flex-grow">
                        <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-gray-200 leading-relaxed flex-grow">{title}</span>
                      </div>
                      <button
                        onClick={() => copyTitle(title)}
                        className="ml-4 px-3 py-1 text-xs bg-purple-600/20 text-purple-300 rounded hover:bg-purple-600/30 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-blue-300">Pro Tip</span>
                </div>
                <p className="text-sm text-gray-300">
                  Use these titles as inspiration! Feel free to combine elements from different options or adjust them to match your brand voice.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tips for Better Results */}
        <div className="mt-12 bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Tips for Better Titles</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h4 className="font-semibold text-green-400 mb-2">✅ Best Practices</h4>
              <ul className="space-y-2">
                <li>• Include your main topic and key findings</li>
                <li>• Mention specific numbers or statistics</li>
                <li>• Provide context about your audience or industry</li>
                <li>• Include the content type (guide, study, analysis)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-400 mb-2">❌ Avoid These</h4>
              <ul className="space-y-2">
                <li>• Very short or vague content descriptions</li>
                <li>• Content without a clear main point</li>
                <li>• Lists without context or purpose</li>
                <li>• Pure technical documentation</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 