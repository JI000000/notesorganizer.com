'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Upload, AlertCircle, CheckCircle, FileText, X } from 'lucide-react'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  isUploading: boolean
  uploadProgress: number
  error?: string
  disabled?: boolean
}

interface DragState {
  isDragOver: boolean
  dragDepth: number
}

export default function UploadZone({ 
  onFileSelect, 
  isUploading, 
  uploadProgress, 
  error, 
  disabled 
}: UploadZoneProps) {
  const [dragState, setDragState] = useState<DragState>({ isDragOver: false, dragDepth: 0 })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    
    setDragState(prev => ({
      isDragOver: true,
      dragDepth: prev.dragDepth + 1
    }))
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    
    setDragState(prev => {
      const newDepth = prev.dragDepth - 1
      return {
        isDragOver: newDepth > 0,
        dragDepth: newDepth
      }
    })
  }, [disabled])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return

    setDragState({ isDragOver: false, dragDepth: 0 })
    
    const files = Array.from(e.dataTransfer.files)
    const zipFile = files.find(file => file.name.endsWith('.zip'))
    
    if (zipFile) {
      setSelectedFile(zipFile)
      onFileSelect(zipFile)
    }
  }, [disabled, onFileSelect])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleSelectFileClick = useCallback(() => {
    if (disabled) return
    fileInputRef.current?.click()
  }, [disabled])

  const clearFile = useCallback(() => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 使用限制说明 */}
      <div className="mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Free Analysis Limits</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span>Up to <strong className="text-white">100 notes</strong> per upload</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span>Maximum <strong className="text-white">5MB</strong> ZIP file size</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span>Up to <strong className="text-white">50KB</strong> per individual note</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span>Total content: <strong className="text-white">200KB</strong> maximum</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-500/20">
              <p className="text-xs text-gray-400">
                Need higher limits? <a href="#" className="text-blue-400 hover:text-blue-300 underline">Upgrade to Pro</a> for unlimited notes, larger files, and priority processing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 主上传区域 */}
      <div
        className={`
          relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer
          ${dragState.isDragOver && !disabled
            ? 'border-blue-400 bg-blue-500/10 scale-[1.02] shadow-2xl shadow-blue-500/20' 
            : disabled
            ? 'border-gray-700 bg-gray-800/30 cursor-not-allowed'
            : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800/70 hover:scale-[1.01]'
          }
          backdrop-blur-sm
          ${isUploading ? 'pointer-events-none' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleSelectFileClick}
      >
        {/* 背景动画 */}
        {dragState.isDragOver && !disabled && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" />
        )}
        
        <div className="relative p-16 text-center">
          <div className="flex flex-col items-center space-y-6">
            {/* 图标区域 */}
            <div className={`
              w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
              ${dragState.isDragOver && !disabled
                ? 'bg-blue-500/30 scale-110 shadow-lg shadow-blue-500/30' 
                : disabled
                ? 'bg-gray-700/30'
                : 'bg-gray-700/50 hover:bg-gray-600/50'
              }
            `}>
              {isUploading ? (
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-blue-500/30 rounded-full animate-spin border-t-blue-500" />
                  <Upload className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              ) : error ? (
                <AlertCircle className="w-12 h-12 text-red-400" />
              ) : (
                <Upload className={`w-12 h-12 transition-colors ${
                  dragState.isDragOver && !disabled ? 'text-blue-400' : 'text-gray-400'
                }`} />
              )}
            </div>
            
            {/* 文本内容 */}
            <div>
              <h3 className={`text-2xl font-semibold mb-2 transition-colors ${
                error ? 'text-red-400' : 'text-white'
              }`}>
                {isUploading ? 'Uploading...' :
                 error ? 'Upload Error' :
                 dragState.isDragOver && !disabled ? 'Drop to upload your files' :
                 selectedFile ? 'File Selected' :
                 'Drop your ZIP file here'}
              </h3>
              <p className="text-gray-400 mb-6">
                {error ? error :
                 isUploading ? 'Please wait while we process your knowledge base...' :
                 'Upload a ZIP file containing your markdown (.md) notes from Obsidian, Logseq, or any PKM tool'}
              </p>
            </div>

            {/* 选中文件信息 */}
            {selectedFile && !isUploading && (
              <div className="bg-gray-800/80 rounded-lg p-4 min-w-80 border border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="font-medium text-white">{selectedFile.name}</div>
                      <div className="text-sm text-gray-400">{formatFileSize(selectedFile.size)}</div>
                    </div>
                  </div>
                  {!disabled && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        clearFile()
                      }}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 上传进度条 */}
            {isUploading && (
              <div className="w-full max-w-md">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Upload Progress</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            {!isUploading && !selectedFile && (
              <button
                disabled={disabled}
                className={`
                  px-8 py-4 font-semibold rounded-xl transition-all duration-200 transform
                  ${disabled 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 hover:shadow-lg'
                  }
                `}
              >
                Select ZIP File
              </button>
            )}

            {/* 错误状态重试按钮 */}
            {error && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  clearFile()
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* 功能预览 */}
      <div className="grid md:grid-cols-3 gap-6 mt-16">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 transition-all duration-300 hover:border-gray-600 hover:bg-gray-800/70">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white">Intelligent Titles</h3>
          <p className="text-gray-400">AI generates clear, descriptive titles that capture the essence of your notes</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 transition-all duration-300 hover:border-gray-600 hover:bg-gray-800/70">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white">Smart Connections</h3>
          <p className="text-gray-400">Discover hidden relationships and build a connected knowledge graph</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 transition-all duration-300 hover:border-gray-600 hover:bg-gray-800/70">
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
  )
}
