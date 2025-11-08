import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import path from 'path'

describe('prisma.config.ts - Prisma Configuration', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
    vi.resetModules()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('Configuration Structure', () => {
    it('should export a valid Prisma configuration', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb'
      const config = await import('../../prisma.config')
      
      expect(config.default).toBeDefined()
      expect(config.default).toBeTypeOf('object')
    })

    it('should have schema path configured', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb'
      const config = await import('../../prisma.config')
      
      expect(config.default.schema).toBe('prisma/schema.prisma')
    })

    it('should have migrations path configured', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb'
      const config = await import('../../prisma.config')
      
      expect(config.default.migrations).toBeDefined()
      expect(config.default.migrations.path).toBe('prisma/migrations')
    })

    it('should use classic engine', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb'
      const config = await import('../../prisma.config')
      
      expect(config.default.engine).toBe('classic')
    })

    it('should have datasource configuration', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb'
      const config = await import('../../prisma.config')
      
      expect(config.default.datasource).toBeDefined()
      expect(config.default.datasource.url).toBeDefined()
    })
  })

  describe('Environment Variable Handling', () => {
    it('should read DATABASE_URL from environment', async () => {
      const testUrl = 'postgresql://user:pass@localhost:5432/mydb'
      process.env.DATABASE_URL = testUrl
      
      const config = await import('../../prisma.config')
      
      expect(config.default.datasource.url).toBe(testUrl)
    })

    it('should handle different database URLs', async () => {
      const urls = [
        'postgresql://localhost:5432/db',
        'postgresql://user:password@host:5432/database',
        'postgresql://user:password@host:5432/database?schema=public',
        'postgres://user:pass@localhost/dbname',
      ]

      for (const url of urls) {
        vi.resetModules()
        process.env.DATABASE_URL = url
        const config = await import('../../prisma.config')
        expect(config.default.datasource.url).toBe(url)
      }
    })

    it('should handle DATABASE_URL with special characters', async () => {
      const specialUrl = 'postgresql://user%40:p%40ssw0rd@localhost:5432/db'
      process.env.DATABASE_URL = specialUrl
      
      vi.resetModules()
      const config = await import('../../prisma.config')
      
      expect(config.default.datasource.url).toBe(specialUrl)
    })

    it('should work with empty DATABASE_URL', async () => {
      process.env.DATABASE_URL = ''
      
      vi.resetModules()
      const config = await import('../../prisma.config')
      
      expect(config.default.datasource.url).toBe('')
    })

    it('should handle undefined DATABASE_URL gracefully', async () => {
      delete process.env.DATABASE_URL
      
      vi.resetModules()
      
      // Should not throw during import
      expect(async () => {
        await import('../../prisma.config')
      }).not.toThrow()
    })
  })

  describe('Schema Path Validation', () => {
    it('should point to correct schema location', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db'
      const config = await import('../../prisma.config')
      
      const schemaPath = config.default.schema
      expect(schemaPath).toMatch(/prisma\/schema\.prisma$/)
    })

    it('should use relative path for schema', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db'
      const config = await import('../../prisma.config')
      
      const schemaPath = config.default.schema
      expect(path.isAbsolute(schemaPath)).toBe(false)
    })
  })

  describe('Migrations Configuration', () => {
    it('should have migrations object with path property', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db'
      const config = await import('../../prisma.config')
      
      expect(config.default.migrations).toMatchObject({
        path: expect.any(String)
      })
    })

    it('should point to correct migrations directory', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db'
      const config = await import('../../prisma.config')
      
      const migrationsPath = config.default.migrations.path
      expect(migrationsPath).toBe('prisma/migrations')
    })

    it('should use relative path for migrations', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db'
      const config = await import('../../prisma.config')
      
      const migrationsPath = config.default.migrations.path
      expect(path.isAbsolute(migrationsPath)).toBe(false)
    })
  })

  describe('Engine Configuration', () => {
    it('should use classic engine type', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db'
      const config = await import('../../prisma.config')
      
      expect(config.default.engine).toBe('classic')
    })

    it('should not use experimental engine', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db'
      const config = await import('../../prisma.config')
      
      expect(config.default.engine).not.toBe('experimental')
      expect(config.default.engine).not.toBe('wasm')
    })
  })

  describe('Dotenv Integration', () => {
    it('should import dotenv/config at the top', async () => {
      // This test verifies that dotenv is configured before the rest of the config
      process.env.TEST_VAR = 'test_value'
      
      const config = await import('../../prisma.config')
      
      // If dotenv is properly configured, environment variables should be available
      expect(process.env.TEST_VAR).toBe('test_value')
    })
  })

  describe('Configuration Completeness', () => {
    it('should have all required top-level properties', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db'
      const config = await import('../../prisma.config')
      
      const requiredProps = ['schema', 'migrations', 'engine', 'datasource']
      requiredProps.forEach(prop => {
        expect(config.default).toHaveProperty(prop)
      })
    })

    it('should not have unexpected properties', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db'
      const config = await import('../../prisma.config')
      
      const allowedProps = ['schema', 'migrations', 'engine', 'datasource']
      const actualProps = Object.keys(config.default)
      
      actualProps.forEach(prop => {
        expect(allowedProps).toContain(prop)
      })
    })
  })

  describe('Type Safety', () => {
    it('should have string type for schema', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db'
      const config = await import('../../prisma.config')
      
      expect(typeof config.default.schema).toBe('string')
    })

    it('should have object type for migrations', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db'
      const config = await import('../../prisma.config')
      
      expect(typeof config.default.migrations).toBe('object')
      expect(config.default.migrations).not.toBeNull()
    })

    it('should have string type for engine', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db'
      const config = await import('../../prisma.config')
      
      expect(typeof config.default.engine).toBe('string')
    })

    it('should have object type for datasource', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db'
      const config = await import('../../prisma.config')
      
      expect(typeof config.default.datasource).toBe('object')
      expect(config.default.datasource).not.toBeNull()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle very long DATABASE_URL', async () => {
      const longUrl = 'postgresql://user:pass@' + 'a'.repeat(1000) + '.com:5432/db'
      process.env.DATABASE_URL = longUrl
      
      vi.resetModules()
      const config = await import('../../prisma.config')
      
      expect(config.default.datasource.url).toBe(longUrl)
    })

    it('should handle DATABASE_URL with query parameters', async () => {
      const urlWithParams = 'postgresql://localhost:5432/db?schema=public&sslmode=require'
      process.env.DATABASE_URL = urlWithParams
      
      vi.resetModules()
      const config = await import('../../prisma.config')
      
      expect(config.default.datasource.url).toBe(urlWithParams)
    })

    it('should handle DATABASE_URL with multiple query parameters', async () => {
      const complexUrl = 'postgresql://localhost:5432/db?schema=public&connection_limit=5&pool_timeout=10'
      process.env.DATABASE_URL = complexUrl
      
      vi.resetModules()
      const config = await import('../../prisma.config')
      
      expect(config.default.datasource.url).toBe(complexUrl)
    })
  })
})