'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Upload, FileText, Zap, Download, AlertCircle, CheckCircle, Clock, Brain, Network, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
}

interface ProcessingStats {
  totalNotes: number
  processedNotes: number
  currentNote?: string
  timeElapsed: number
  estimatedCost: number
}

interface Results {
  notes: any[]
  knowledgeGraph: any
  healthReport: any
  stats: any
}

export default function WorkbenchPage() {
  const [status, setStatus] = useState<ProcessingStatus>({
    status: 'idle',
    progress: 0,
    message: 'Ready to transform your notes'
  })
  const [isDragOver, setIsDragOver] = useState(false)
  const [results, setResults] = useState<Results | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout>()
  const startTimeRef = useRef<number>()
  const router = useRouter()

  // 清除localStorage中的保存状态
  const clearSavedStatus = () => {
    localStorage.removeItem('workbench_jobId')
    localStorage.removeItem('workbench_status_details')
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }
  }

  // 从localStorage恢复状态
  useEffect(() => {
    const savedJobId = localStorage.getItem('workbench_jobId');
    const savedStatusJson = localStorage.getItem('workbench_status_details');

    if (savedJobId && savedStatusJson) {
      try {
        const parsedStatus = JSON.parse(savedStatusJson);
        // 尝试加载完整状态和结果，或者恢复轮询
        if (parsedStatus.status === 'completed') {
          setStatus(parsedStatus); // 恢复基本完成状态
          // 在刷新时尝试为已完成的任务重新获取结果
          fetch(`/api/project/${savedJobId}/results`)
            .then(res => {
              if (res.ok) return res.json();
              throw new Error(`Failed to re-fetch results: ${res.statusText}`);
            })
            .then(resultsData => setResults(resultsData))
            .catch(error => {
              console.error('Failed to re-fetch completed results on load:', error);
              // 如果结果无法获取，可以选择清除并重置
              clearSavedStatus();
              resetWorkbench();
            });
        } else if (parsedStatus.status !== 'error') {
          // 恢复处理中/排队中的任务轮询
          setStatus(parsedStatus);
          startPolling(savedJobId);
        } else {
          // 如果保存状态是错误，则清除并重置
          clearSavedStatus();
          resetWorkbench();
        }
      } catch (e) {
        console.error('Error parsing saved status from localStorage:', e);
        clearSavedStatus();
        resetWorkbench();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 保存状态到localStorage
  useEffect(() => {
    if (status.jobId) {
      localStorage.setItem('workbench_jobId', status.jobId);
      localStorage.setItem('workbench_status_details', JSON.stringify({
        status: status.status,
        progress: status.progress,
        message: status.message,
        fileName: status.fileName,
        fileSize: status.fileSize,
        noteCount: status.noteCount,
        currentStep: status.currentStep,
        timeElapsed: status.timeElapsed,
      }));
    } else { // 如果没有jobId，则清除旧的保存状态
      clearSavedStatus();
    }
  }, [status]); // 仅依赖status对象的变化

  const uploadFile = async (file: File) => {
    if (!file.name.endsWith('.zip')) {
      setStatus({
        status: 'error',
        progress: 0,
        message: 'Please upload a ZIP file containing your markdown notes'
      })
      return
    }

    setStatus({
      status: 'uploading',
      progress: 10,
      message: 'Uploading your knowledge archive...',
      fileName: file.name,
      fileSize: Math.round(file.size / 1024 / 1024 * 10) / 10
    })

    const formData = new FormData()
    formData.append('zipFile', file)

    try {
      const response = await fetch('/api/project/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const { jobId } = await response.json()
      
      setStatus(prev => ({
        ...prev,
        status: 'queued',
        progress: 20,
        message: 'Upload complete! Preparing AI analysis...',
        jobId
      }))

      startTimeRef.current = Date.now()
      startPolling(jobId)

    } catch (error) {
      console.error('Upload error:', error)
      setStatus({
        status: 'error',
        progress: 0,
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    }
  }

  const startPolling = (jobId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/project/${jobId}/status`)
        
        if (!response.ok) {
          if (response.status === 404) {
            if (process.env.NODE_ENV === 'development') {
              console.log('💡 DEV-MODE: JobId not found (likely due to hot-reload). Resetting workbench automatically.')
              resetWorkbench()
            } else {
              setStatus(prev => ({
                ...prev,
                status: 'error',
                message: 'Analysis session expired. Please upload again.'
              }))
              clearSavedStatus()
            }
            return
          }
          throw new Error(`Status check failed: ${response.statusText}`)
        }

        const statusData = await response.json()
        const timeElapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0

        if (statusData.status === 'COMPLETED') {
          setStatus(prev => ({
            ...prev,
            status: 'completed',
            progress: 100,
            message: 'Analysis complete! Loading your transformed knowledge...',
            timeElapsed: Math.round(timeElapsed / 1000)
          }))

          // 获取结果
          const resultsResponse = await fetch(`/api/project/${jobId}/results`)
          if (resultsResponse.ok) {
            const resultsData = await resultsResponse.json()
            setResults(resultsData)
            clearSavedStatus()
          } else {
             if (resultsResponse.status === 404 && process.env.NODE_ENV === 'development') {
                console.log('💡 DEV-MODE: Results not found (likely due to hot-reload). Resetting workbench automatically.')
                resetWorkbench()
                return;
             }
             throw new Error(`Failed to fetch results: ${resultsResponse.statusText}`)
          }

          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
          }

        } else if (statusData.status === 'FAILED') {
          setStatus(prev => ({
            ...prev,
            status: 'error',
            message: statusData.error || 'Analysis failed. Please try again.'
          }))
          clearSavedStatus()

          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
          }

        } else {
          // 处理进行中的状态
          let progressPercentage = 30
          let currentMessage = 'Processing your notes with AI...'
          let currentStep = 'Analyzing'

          if (statusData.stats) {
            const { processedNotes = 0, totalNotes = 1 } = statusData.stats
            progressPercentage = 30 + (processedNotes / totalNotes) * 60
            currentMessage = `Analyzing note ${processedNotes + 1} of ${totalNotes}...`
            currentStep = statusData.stats.currentNote ? `Processing: ${statusData.stats.currentNote}` : 'Analyzing notes'
          }

          setStatus(prev => ({
            ...prev,
            status: 'processing',
            progress: Math.min(progressPercentage, 95),
            message: currentMessage,
            currentStep,
            timeElapsed: Math.round(timeElapsed / 1000),
            noteCount: statusData.stats?.totalNotes
          }))
        }

      } catch (error) {
        console.error('Polling error:', error)
        setStatus(prev => ({
          ...prev,
          status: 'error',
          message: 'Connection lost. Please refresh and try again.'
        }))
        clearSavedStatus()
      }
    }

    poll() // 立即执行一次
    pollIntervalRef.current = setInterval(poll, 2000) // 每2秒轮询一次
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      uploadFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      uploadFile(files[0])
    }
  }

  const handleSelectFileClick = () => {
    console.log('Select file button clicked')
    if (fileInputRef.current) {
      console.log('fileInputRef is available, triggering click')
      fileInputRef.current.click()
    } else {
      console.error('fileInputRef.current is null or not available')
    }
  }

  const downloadResults = () => {
    if (!results || !status.jobId) return

    // 创建下载链接
    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `organized-notes-${status.jobId.slice(0, 8)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const resetWorkbench = () => {
    setStatus({
      status: 'idle',
      progress: 0,
      message: 'Ready to transform your notes'
    })
    setResults(null)
    clearSavedStatus()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const cancelProcessing = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }
    clearSavedStatus()
    resetWorkbench()
  }

  // 上传界面
  if (status.status === 'idle') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Knowledge Workbench
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Upload your markdown notes and watch as AI transforms them into a 
              beautifully organized, interconnected knowledge garden with insights 
              and connections you never knew existed.
            </p>
          </div>

          {/* Upload Area */}
          <div className="max-w-4xl mx-auto">
            <div
              className={`
                relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300
                ${isDragOver 
                  ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' 
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800/70'
                }
                backdrop-blur-sm
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-6">
                <div className={`
                  w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
                  ${isDragOver ? 'bg-blue-500/20 scale-110' : 'bg-gray-700/50'}
                `}>
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-white">Drop your ZIP file here</h3>
                  <p className="text-gray-400 mb-6">
                    Upload a ZIP file containing your markdown (.md) notes from Obsidian, Logseq, or any PKM tool
                  </p>
                </div>

                <button
                  onClick={handleSelectFileClick}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  Select ZIP File
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Intelligent Titles</h3>
                <p className="text-gray-400">AI generates clear, descriptive titles that capture the essence of your notes</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Smart Connections</h3>
                <p className="text-gray-400">Discover hidden relationships and build a connected knowledge graph</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Health Insights</h3>
                <p className="text-gray-400">Get detailed analysis of your knowledge base&apos;s structure and quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 处理中界面
  if (status.status !== 'completed') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Status Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-4 text-white">
                {status.status === 'uploading' && 'Uploading'}
                {status.status === 'queued' && 'Queued for processing'}
                {status.status === 'processing' && 'AI Analysis in Progress'}
                {status.status === 'error' && 'Error Occurred'}
              </h1>
              <p className="text-xl text-gray-300">
                {status.message}
              </p>
            </div>

            {/* Progress Bar */}
            {status.status !== 'error' && (
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(status.progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${status.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* File Info */}
            {status.fileName && (
              <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-400">File</div>
                    <div className="font-medium text-white">{status.fileName}</div>
                  </div>
                  
                  {status.noteCount && (
                    <div>
                      <div className="text-2xl font-bold text-purple-400 mb-1">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-400">Notes</div>
                      <div className="font-medium text-white">{status.noteCount}</div>
                    </div>
                  )}
                  
                  {status.fileSize && (
                    <div>
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-400">Size</div>
                      <div className="font-medium text-white">{status.fileSize} MB</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Current Step */}
            {status.currentStep && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-blue-300">{status.currentStep}</span>
                </div>
              </div>
            )}

            {/* Time Info */}
            {status.timeElapsed && (
              <div className="text-center text-gray-400 mb-6">
                <span>Processing time: {Math.floor(status.timeElapsed / 60)}m {status.timeElapsed % 60}s</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {status.status !== 'error' && (
                <button
                  onClick={cancelProcessing}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
              
              {status.status === 'error' && (
                <button
                  onClick={resetWorkbench}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 结果展示界面
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Analysis Complete!</h1>
            <p className="text-gray-300">Your knowledge has been transformed and organized</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={downloadResults}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-4-10v10" />
              </svg>
              Download Results
            </button>
            <button
              onClick={resetWorkbench}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              New Analysis
            </button>
          </div>
        </div>

        {/* Results Dashboard */}
        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Overview */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl font-bold text-blue-400 mb-2">{results.notes?.length || 0}</div>
                <div className="text-gray-300">Notes Processed</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl font-bold text-purple-400 mb-2">{results.knowledgeGraph?.edges?.length || 0}</div>
                <div className="text-gray-300">Connections Found</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl font-bold text-green-400 mb-2">{results.healthReport?.overallScore || 0}</div>
                <div className="text-gray-300">Health Score</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl font-bold text-yellow-400 mb-2">${(results.stats?.estimatedCost || 0).toFixed(3)}</div>
                <div className="text-gray-300">Processing Cost</div>
              </div>
            </div>

            {/* Notes List */}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Organized Notes</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {results.notes?.map((note, index) => (
                  <div key={note.id} className="p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50">
                    <h4 className="font-semibold text-white mb-1">{note.analysis.title}</h4>
                    <p className="text-gray-400 text-sm mb-2">{note.analysis.summary}</p>
                    <div className="flex flex-wrap gap-1">
                      {note.analysis.tags.slice(0, 3).map((tag: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Report */}
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Knowledge Health</h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Overall Score</span>
                    <span className="text-2xl font-bold text-green-400">{results.healthReport?.overallScore || 0}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${results.healthReport?.overallScore || 0}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Top Topics</h4>
                    {results.healthReport?.insights?.knowledgeDistribution?.topTopics?.slice(0, 3).map((topic: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-300">{topic.topic}</span>
                        <span className="text-gray-400">{topic.count} notes</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Connections</h4>
                    <div className="text-sm text-gray-300">
                      <div>Connected: {results.healthReport?.insights?.connectionHealth?.connectedNotes || 0}</div>
                      <div>Isolated: {results.healthReport?.insights?.connectionHealth?.isolatedNotes || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 