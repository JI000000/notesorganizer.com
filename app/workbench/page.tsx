'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import UploadZone from '@/components/workbench/UploadZone'
import ProcessingDashboard from '@/components/workbench/ProcessingDashboard'
import ResultsDashboard from '@/components/workbench/ResultsDashboard'

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
  const [results, setResults] = useState<Results | null>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout>()
  const startTimeRef = useRef<number>()
  const router = useRouter()

  const clearSavedStatus = useCallback(() => {
    localStorage.removeItem('workbench_jobId')
    localStorage.removeItem('workbench_status_details')
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }
  }, [])

  const resetWorkbench = useCallback(() => {
    setStatus({
      status: 'idle',
      progress: 0,
      message: 'Ready to transform your notes'
    })
    setResults(null)
    clearSavedStatus()
  }, [clearSavedStatus])

  const startPolling = useCallback((jobId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/project/${jobId}/status`)
        
        if (!response.ok) {
          if (response.status === 404) {
            if (process.env.NODE_ENV === 'development') {
              console.log('💡 DEV-MODE: JobId not found (likely due to hot-reload). Resetting workbench automatically.')
              resetWorkbench()
            } else {
              setStatus(prev => ({ ...prev, status: 'error', message: 'Analysis session expired. Please upload again.' }))
              clearSavedStatus()
            }
            return
          }
          throw new Error(`Status check failed: ${response.statusText}`)
        }

        const statusData = await response.json()
        const timeElapsed = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0

        if (statusData.status === 'COMPLETED') {
          setStatus(prev => ({
            ...prev,
            status: 'completed',
            progress: 100,
            message: 'Analysis complete!',
            timeElapsed
          }))
          setResults(statusData.results)
          clearSavedStatus()
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
        } else {
          let progressPercentage = 30;
          let currentMessage = 'Processing your notes with AI...';
          let currentStep = statusData.currentStep || 'Analyzing...';
          
          if(statusData.stats) {
              const { processedNotes = 0, totalNotes = 1 } = statusData.stats;
              progressPercentage = 30 + (processedNotes / totalNotes) * 60;
              currentMessage = `Analyzing note ${processedNotes} of ${totalNotes}...`;
          }

          setStatus(prev => ({
            ...prev,
            status: 'processing',
            progress: Math.min(progressPercentage, 95),
            message: currentMessage,
            currentStep,
            timeElapsed
          }))
        }
      } catch (error) {
        console.error('Polling error:', error)
        setStatus(prev => ({ ...prev, status: 'error', message: 'Connection lost. Please refresh and try again.' }))
        clearSavedStatus()
      }
    }
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    pollIntervalRef.current = setInterval(poll, 2000)
  }, [resetWorkbench, clearSavedStatus])

  useEffect(() => {
    const savedJobId = localStorage.getItem('workbench_jobId');
    const savedStatusJson = localStorage.getItem('workbench_status_details');

    if (savedJobId && savedStatusJson) {
      try {
        const parsedStatus = JSON.parse(savedStatusJson);
        if (parsedStatus.status === 'completed') {
          setStatus(prev => ({ 
            ...prev, 
            status: 'processing',
            message: 'Restoring previous session...',
            progress: 98
          }));
          fetch(`/api/project/${savedJobId}/results`)
            .then(res => {
              if (res.ok) return res.json();
              throw new Error(`Failed to re-fetch results: ${res.statusText}`);
            })
            .then(data => {
              setResults(data)
              setStatus(parsedStatus)
            })
            .catch(error => {
              console.error('Failed to re-fetch completed results on load:', error);
              clearSavedStatus();
              resetWorkbench();
            });
        } else if (parsedStatus.status !== 'error') {
          setStatus(parsedStatus);
          startPolling(savedJobId);
        } else {
          clearSavedStatus();
          resetWorkbench();
        }
      } catch (e) {
        console.error('Error parsing saved status from localStorage:', e);
        clearSavedStatus();
        resetWorkbench();
      }
    }
  }, [resetWorkbench, startPolling, clearSavedStatus]);

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
    } else {
      clearSavedStatus();
    }
  }, [status]);

  useEffect(() => {
    // This effect handles clearing the polling interval when the component unmounts.
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const uploadFile = async (file: File) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      setStatus({
        status: 'error',
        progress: 0,
        message: `File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB. Your file is ${Math.round(file.size / 1024 / 1024 * 10) / 10}MB.`
      });
      return;
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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Upload failed: ${response.statusText}`)
      }

      setStatus(prev => ({
        ...prev,
        status: 'queued',
        progress: 20,
        message: 'Upload complete! Preparing AI analysis...',
        jobId: data.jobId,
        noteCount: data.markdownCount,
      }))

      startTimeRef.current = Date.now()
      startPolling(data.jobId)

    } catch (error) {
      console.error('Upload error:', error)
      setStatus({
        status: 'error',
        progress: 0,
        message: `${error instanceof Error ? error.message : 'An unknown error occurred'}`
      })
    }
  }

  const downloadResults = () => {
    if (!results || !status.jobId) return;
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `organized-notes-${status.jobId.slice(0, 8)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const cancelProcessing = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    clearSavedStatus();
    resetWorkbench();
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {(status.status === 'idle' || status.status === 'error') && (
          <UploadZone
            onFileSelect={uploadFile}
            isUploading={false}
            uploadProgress={status.progress}
            error={status.status === 'error' ? status.message : undefined}
          />
        )}

        {(status.status === 'uploading' || status.status === 'queued' || status.status === 'processing') && (
          <ProcessingDashboard status={status} />
        )}

        {status.status === 'completed' && results && (
          <ResultsDashboard
            results={results}
            onReset={resetWorkbench}
            onDownload={downloadResults}
            fileName={status.fileName || 'your_notes'}
          />
        )}
      </div>
    </div>
  )
} 