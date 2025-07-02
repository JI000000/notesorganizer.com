// Simple in-memory KV store for development
class MockKV {
  private store = new Map<string, { value: any; expiry?: number }>()

  async set(key: string, value: any, options?: { ex?: number }): Promise<void> {
    const expiry = options?.ex ? Date.now() + (options.ex * 1000) : undefined
    this.store.set(key, { value, expiry })
  }

  async get(key: string): Promise<any> {
    const item = this.store.get(key)
    
    if (!item) return null
    
    // Check if expired
    if (item.expiry && Date.now() > item.expiry) {
      this.store.delete(key)
      return null
    }
    
    return item.value
  }

  async del(key: string): Promise<void> {
    this.store.delete(key)
  }

  // Clean up expired items
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.store.entries()) {
      if (item.expiry && now > item.expiry) {
        this.store.delete(key)
      }
    }
  }
}

// Create singleton instance
const mockKV = new MockKV()

// Clean up expired items every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => mockKV.cleanup(), 5 * 60 * 1000)
}

export { mockKV as kv } 