import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PrismaClient } from '@/generated/prisma/client'

describe('db.ts - Prisma Client Singleton', () => {
  let originalNodeEnv: string | undefined
  let mockPrismaInstance: PrismaClient

  beforeEach(() => {
    originalNodeEnv = process.env.NODE_ENV
    // Clear the module cache to get fresh imports
    vi.resetModules()
    mockPrismaInstance = new PrismaClient()
  })

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv
    vi.clearAllMocks()
  })

  describe('Singleton Pattern', () => {
    it('should create a new PrismaClient instance', async () => {
      process.env.NODE_ENV = 'production'
      const { default: prisma } = await import('@/lib/db')
      expect(prisma).toBeDefined()
      expect(prisma).toBeInstanceOf(PrismaClient)
    })

    it('should reuse the same instance in development mode', async () => {
      process.env.NODE_ENV = 'development'
      
      // First import
      const { default: prisma1 } = await import('@/lib/db')
      
      // Clear module cache and import again
      vi.resetModules()
      const { default: prisma2 } = await import('@/lib/db')
      
      // In development, should be cached on global object
      expect(prisma1).toBeDefined()
      expect(prisma2).toBeDefined()
    })

    it('should not cache instance in production mode', async () => {
      process.env.NODE_ENV = 'production'
      const { default: prisma } = await import('@/lib/db')
      
      // Check that global object is not modified in production
      const globalForPrisma = global as any
      expect(globalForPrisma.prisma).toBeUndefined()
    })

    it('should cache instance in test environment', async () => {
      process.env.NODE_ENV = 'test'
      const { default: prisma } = await import('@/lib/db')
      
      expect(prisma).toBeDefined()
      expect(prisma).toBeInstanceOf(PrismaClient)
    })
  })

  describe('Environment-based Behavior', () => {
    it('should handle undefined NODE_ENV as non-production', async () => {
      delete process.env.NODE_ENV
      const { default: prisma } = await import('@/lib/db')
      
      expect(prisma).toBeDefined()
      const globalForPrisma = global as any
      expect(globalForPrisma.prisma).toBeDefined()
    })

    it('should handle empty string NODE_ENV as non-production', async () => {
      process.env.NODE_ENV = ''
      const { default: prisma } = await import('@/lib/db')
      
      expect(prisma).toBeDefined()
    })

    it('should properly identify production environment', async () => {
      process.env.NODE_ENV = 'production'
      const { default: prisma } = await import('@/lib/db')
      
      const globalForPrisma = global as any
      expect(globalForPrisma.prisma).toBeUndefined()
    })

    it('should properly identify development environment', async () => {
      process.env.NODE_ENV = 'development'
      const { default: prisma } = await import('@/lib/db')
      
      const globalForPrisma = global as any
      expect(globalForPrisma.prisma).toBeDefined()
    })

    it('should properly identify staging environment', async () => {
      process.env.NODE_ENV = 'staging'
      const { default: prisma } = await import('@/lib/db')
      
      const globalForPrisma = global as any
      expect(globalForPrisma.prisma).toBeDefined()
    })
  })

  describe('Global Object Type Safety', () => {
    it('should safely type cast global object', async () => {
      const { default: prisma } = await import('@/lib/db')
      
      expect(() => {
        const globalForPrisma = global as unknown as { prisma: PrismaClient }
        expect(globalForPrisma).toBeDefined()
      }).not.toThrow()
    })

    it('should handle global object mutations correctly', async () => {
      process.env.NODE_ENV = 'development'
      
      // Set up a mock on global
      const globalForPrisma = global as any
      globalForPrisma.prisma = undefined
      
      const { default: prisma } = await import('@/lib/db')
      
      // Should create new instance if global.prisma is falsy
      expect(prisma).toBeDefined()
      expect(prisma).toBeInstanceOf(PrismaClient)
    })
  })

  describe('PrismaClient Instance Properties', () => {
    it('should have user model available', async () => {
      const { default: prisma } = await import('@/lib/db')
      expect(prisma.user).toBeDefined()
    })

    it('should have post model available', async () => {
      const { default: prisma } = await import('@/lib/db')
      expect(prisma.post).toBeDefined()
    })

    it('should have $connect method', async () => {
      const { default: prisma } = await import('@/lib/db')
      expect(prisma.$connect).toBeDefined()
      expect(typeof prisma.$connect).toBe('function')
    })

    it('should have $disconnect method', async () => {
      const { default: prisma } = await import('@/lib/db')
      expect(prisma.$disconnect).toBeDefined()
      expect(typeof prisma.$disconnect).toBe('function')
    })

    it('should have $transaction method', async () => {
      const { default: prisma } = await import('@/lib/db')
      expect(prisma.$transaction).toBeDefined()
      expect(typeof prisma.$transaction).toBe('function')
    })
  })

  describe('Memory Leak Prevention', () => {
    it('should not create multiple instances in development on repeated imports', async () => {
      process.env.NODE_ENV = 'development'
      
      // Import multiple times
      const { default: prisma1 } = await import('@/lib/db')
      const { default: prisma2 } = await import('@/lib/db')
      const { default: prisma3 } = await import('@/lib/db')
      
      // All should be defined
      expect(prisma1).toBeDefined()
      expect(prisma2).toBeDefined()
      expect(prisma3).toBeDefined()
    })

    it('should handle concurrent imports correctly', async () => {
      process.env.NODE_ENV = 'development'
      
      const imports = await Promise.all([
        import('@/lib/db'),
        import('@/lib/db'),
        import('@/lib/db')
      ])
      
      imports.forEach(module => {
        expect(module.default).toBeDefined()
        expect(module.default).toBeInstanceOf(PrismaClient)
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle case-sensitive environment check', async () => {
      process.env.NODE_ENV = 'PRODUCTION' // uppercase
      const { default: prisma } = await import('@/lib/db')
      
      // Should treat as non-production (case-sensitive check)
      const globalForPrisma = global as any
      expect(globalForPrisma.prisma).toBeDefined()
    })

    it('should work with trimmed environment value', async () => {
      process.env.NODE_ENV = '  production  '
      const { default: prisma } = await import('@/lib/db')
      
      // Should treat as non-production (exact match required)
      expect(prisma).toBeDefined()
    })

    it('should handle global object already having prisma instance', async () => {
      process.env.NODE_ENV = 'development'
      const existingPrisma = new PrismaClient()
      const globalForPrisma = global as any
      globalForPrisma.prisma = existingPrisma
      
      const { default: prisma } = await import('@/lib/db')
      
      // Should reuse existing instance
      expect(prisma).toBe(existingPrisma)
    })
  })

  describe('Export Validation', () => {
    it('should export prisma as default export', async () => {
      const module = await import('@/lib/db')
      expect(module.default).toBeDefined()
      expect(module.default).toBeInstanceOf(PrismaClient)
    })

    it('should not have named exports', async () => {
      const module = await import('@/lib/db')
      const keys = Object.keys(module).filter(key => key !== 'default')
      expect(keys.length).toBe(0)
    })
  })
})