'use client'

import React from 'react'
import { Brain, Network, Clock, Zap, FileText, AlertCircle, TrendingUp } from 'lucide-react'

interface ProcessingStatus {
  status: 'idle' | 'uploading' | 'queued' | 'processing' | 'completed' | 'error'
  progress: number
  message: string
  jobId?: string
  fileName?: string
  noteCount?: number
  fileSize?: number
  currentStep?: string
  timeElapsed?: number
  estimatedTimeLeft?: number
  // The following are calculated fields for display, might not be in the core status object
  totalNotes?: number
  processedNotes?: number
  currentNote?: string
}

interface ProcessingDashboardProps {
  status: ProcessingStatus
  onCancel?: () => void
}

export default function ProcessingDashboard({ status, onCancel }: ProcessingDashboardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case 'uploading':
        return <Zap className="w-8 h-8 text-blue-400 animate-pulse" />
      case 'queued':
        return <Clock className="w-8 h-8 text-yellow-400 animate-pulse" />
      case 'processing':
        return <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-400" />
      default:
        return <Brain className="w-8 h-8 text-gray-400" />
    }
  }

  const getStatusMessage = () => {
    switch (status.status) {
      case 'uploading':
        return 'Uploading your knowledge archive...'
      case 'queued':
        return 'Queued for AI analysis...'
      case 'processing':
        return 'AI is analyzing your notes...'
      case 'error':
        return status.message || 'An error occurred during processing'
      default:
        return 'Processing...'
    }
  }

  const getProgressSteps = () => {
    const steps = [
      { label: 'Upload', progress: status.status === 'uploading' ? status.progress : status.status === 'queued' || status.status === 'processing' ? 100 : 0 },
      { label: 'Queue', progress: status.status === 'queued' ? 50 : status.status === 'processing' ? 100 : 0 },
      { label: 'Analyze', progress: status.status === 'processing' ? status.progress : 0 }
    ]
    return steps
  }

  const processedNotes = status.processedNotes || 0;
  const totalNotes = status.totalNotes || status.noteCount || 1;

  return (
    <div className="bg-gray-900 text-white rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50">
      <div className="p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              {getStatusIcon()}
              {status.status === 'processing' && (
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin"></div>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Knowledge Analysis
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              {getStatusMessage()}
            </p>
          </div>

          {/* File Information */}
          {(status.fileName || status.fileSize || status.noteCount) && (
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700">
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
                <FileText className="w-5 h-5 mr-3 text-blue-400" />
                Upload Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {status.fileName && (
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">File Name</div>
                    <div className="font-medium text-white truncate text-xs md:text-base">{status.fileName}</div>
                  </div>
                )}
                
                {status.noteCount && (
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">Notes Found</div>
                    <div className="font-medium text-white">{status.noteCount} notes</div>
                  </div>
                )}
                
                {status.fileSize && (
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">File Size</div>
                    <div className="font-medium text-white">{status.fileSize} MB</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Real-time Processing Stats */}
          {status.status === 'processing' && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Processing Progress */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h4 className="text-base font-semibold mb-4 text-white flex items-center">
                  <Brain className="w-5 h-5 mr-3 text-purple-400" />
                  Analysis Progress
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Notes Processed</span>
                      <span>{processedNotes} / {totalNotes}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(processedNotes / totalNotes) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  {status.currentNote && (
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mt-4">
                      <div className="text-xs text-purple-300 mb-1">Currently Processing:</div>
                      <div className="text-white font-medium truncate text-sm">{status.currentNote}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Information */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h4 className="text-base font-semibold mb-4 text-white flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-blue-400" />
                  Timing
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Elapsed Time:</span>
                    <span className="text-white font-mono">{formatTime(status.timeElapsed || 0)}</span>
                  </div>
                  {status.estimatedTimeLeft && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Est. Remaining:</span>
                      <span className="text-blue-400 font-mono">{formatTime(status.estimatedTimeLeft)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Processing Rate:</span>
                    <span className="text-green-400 font-mono">
                      {(status.timeElapsed || 0) > 0 ? Math.round((processedNotes / (status.timeElapsed || 1)) * 60) : 0} notes/min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            {onCancel && status.status !== 'error' && (
              <button
                onClick={onCancel}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
            )}
            
            {status.status === 'error' && (
              <button
                onClick={onCancel} // Assuming onCancel is also the reset/try again function
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Try Again
              </button>
            )}
          </div>
      </div>
    </div>
  )
}
