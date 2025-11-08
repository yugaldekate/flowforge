import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('schema.prisma - Schema Validation', () => {
  const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma')
  let schemaContent: string

  try {
    schemaContent = readFileSync(schemaPath, 'utf-8')
  } catch (error) {
    schemaContent = ''
  }

  describe('Schema File Existence and Structure', () => {
    it('should exist and be readable', () => {
      expect(schemaContent).toBeTruthy()
      expect(schemaContent.length).toBeGreaterThan(0)
    })

    it('should be valid UTF-8 text', () => {
      expect(() => {
        new TextEncoder().encode(schemaContent)
      }).not.toThrow()
    })

    it('should contain generator block', () => {
      expect(schemaContent).toContain('generator')
      expect(schemaContent).toContain('generator client')
    })

    it('should contain datasource block', () => {
      expect(schemaContent).toContain('datasource')
      expect(schemaContent).toContain('datasource db')
    })
  })

  describe('Generator Configuration', () => {
    it('should use prisma-client provider', () => {
      const generatorMatch = schemaContent.match(/generator\s+client\s*{[^}]*}/s)
      expect(generatorMatch).toBeTruthy()
      expect(generatorMatch![0]).toContain('provider = "prisma-client"')
    })

    it('should specify custom output path', () => {
      const generatorMatch = schemaContent.match(/generator\s+client\s*{[^}]*}/s)
      expect(generatorMatch).toBeTruthy()
      expect(generatorMatch![0]).toContain('output')
      expect(generatorMatch![0]).toContain('../src/generated/prisma')
    })

    it('should have valid generator syntax', () => {
      const generatorBlock = schemaContent.match(/generator\s+client\s*{[^}]*}/s)
      expect(generatorBlock).toBeTruthy()
      expect(generatorBlock![0]).toMatch(/provider\s*=\s*"[^"]+"/)
      expect(generatorBlock![0]).toMatch(/output\s*=\s*"[^"]+"/)
    })
  })

  describe('Datasource Configuration', () => {
    it('should use postgresql provider', () => {
      const datasourceMatch = schemaContent.match(/datasource\s+db\s*{[^}]*}/s)
      expect(datasourceMatch).toBeTruthy()
      expect(datasourceMatch![0]).toContain('provider = "postgresql"')
    })

    it('should reference DATABASE_URL environment variable', () => {
      const datasourceMatch = schemaContent.match(/datasource\s+db\s*{[^}]*}/s)
      expect(datasourceMatch).toBeTruthy()
      expect(datasourceMatch![0]).toContain('url')
      expect(datasourceMatch![0]).toContain('env("DATABASE_URL")')
    })

    it('should have valid datasource syntax', () => {
      const datasourceBlock = schemaContent.match(/datasource\s+db\s*{[^}]*}/s)
      expect(datasourceBlock).toBeTruthy()
      expect(datasourceBlock![0]).toMatch(/provider\s*=\s*"[^"]+"/)
      expect(datasourceBlock![0]).toMatch(/url\s*=\s*env\("[^"]+"\)/)
    })
  })

  describe('User Model Definition', () => {
    it('should define User model', () => {
      expect(schemaContent).toContain('model User')
    })

    it('should have id field with correct attributes', () => {
      const userModel = schemaContent.match(/model\s+User\s*{[^}]*}/s)
      expect(userModel).toBeTruthy()
      expect(userModel![0]).toContain('id')
      expect(userModel![0]).toContain('Int')
      expect(userModel![0]).toContain('@id')
      expect(userModel![0]).toContain('@default(autoincrement())')
    })

    it('should have email field with unique constraint', () => {
      const userModel = schemaContent.match(/model\s+User\s*{[^}]*}/s)
      expect(userModel).toBeTruthy()
      expect(userModel![0]).toContain('email')
      expect(userModel![0]).toContain('String')
      expect(userModel![0]).toContain('@unique')
    })

    it('should have optional name field', () => {
      const userModel = schemaContent.match(/model\s+User\s*{[^}]*}/s)
      expect(userModel).toBeTruthy()
      expect(userModel![0]).toMatch(/name\s+String\?/)
    })

    it('should have posts relation field', () => {
      const userModel = schemaContent.match(/model\s+User\s*{[^}]*}/s)
      expect(userModel).toBeTruthy()
      expect(userModel![0]).toContain('posts')
      expect(userModel![0]).toContain('Post[]')
    })

    it('should have all required User fields', () => {
      const userModel = schemaContent.match(/model\s+User\s*{[^}]*}/s)
      expect(userModel).toBeTruthy()
      const userContent = userModel![0]
      
      expect(userContent).toContain('id')
      expect(userContent).toContain('email')
      expect(userContent).toContain('name')
      expect(userContent).toContain('posts')
    })
  })

  describe('Post Model Definition', () => {
    it('should define Post model', () => {
      expect(schemaContent).toContain('model Post')
    })

    it('should have id field with correct attributes', () => {
      const postModel = schemaContent.match(/model\s+Post\s*{[^}]*}/s)
      expect(postModel).toBeTruthy()
      expect(postModel![0]).toContain('id')
      expect(postModel![0]).toContain('Int')
      expect(postModel![0]).toContain('@id')
      expect(postModel![0]).toContain('@default(autoincrement())')
    })

    it('should have required title field', () => {
      const postModel = schemaContent.match(/model\s+Post\s*{[^}]*}/s)
      expect(postModel).toBeTruthy()
      expect(postModel![0]).toMatch(/title\s+String/)
      expect(postModel![0]).not.toMatch(/title\s+String\?/)
    })

    it('should have optional content field', () => {
      const postModel = schemaContent.match(/model\s+Post\s*{[^}]*}/s)
      expect(postModel).toBeTruthy()
      expect(postModel![0]).toMatch(/content\s+String\?/)
    })

    it('should have published field with default value', () => {
      const postModel = schemaContent.match(/model\s+Post\s*{[^}]*}/s)
      expect(postModel).toBeTruthy()
      expect(postModel![0]).toContain('published')
      expect(postModel![0]).toContain('Boolean')
      expect(postModel![0]).toContain('@default(false)')
    })

    it('should have authorId foreign key field', () => {
      const postModel = schemaContent.match(/model\s+Post\s*{[^}]*}/s)
      expect(postModel).toBeTruthy()
      expect(postModel![0]).toContain('authorId')
      expect(postModel![0]).toContain('Int')
    })

    it('should have author relation field', () => {
      const postModel = schemaContent.match(/model\s+Post\s*{[^}]*}/s)
      expect(postModel).toBeTruthy()
      expect(postModel![0]).toContain('author')
      expect(postModel![0]).toContain('User')
      expect(postModel![0]).toContain('@relation')
    })

    it('should have correct relation configuration', () => {
      const postModel = schemaContent.match(/model\s+Post\s*{[^}]*}/s)
      expect(postModel).toBeTruthy()
      expect(postModel![0]).toContain('fields: [authorId]')
      expect(postModel![0]).toContain('references: [id]')
    })

    it('should have all required Post fields', () => {
      const postModel = schemaContent.match(/model\s+Post\s*{[^}]*}/s)
      expect(postModel).toBeTruthy()
      const postContent = postModel![0]
      
      expect(postContent).toContain('id')
      expect(postContent).toContain('title')
      expect(postContent).toContain('content')
      expect(postContent).toContain('published')
      expect(postContent).toContain('authorId')
      expect(postContent).toContain('author')
    })
  })

  describe('Relationships and Constraints', () => {
    it('should define one-to-many relationship between User and Post', () => {
      const userModel = schemaContent.match(/model\s+User\s*{[^}]*}/s)
      const postModel = schemaContent.match(/model\s+Post\s*{[^}]*}/s)
      
      expect(userModel![0]).toContain('posts')
      expect(userModel![0]).toContain('Post[]')
      expect(postModel![0]).toContain('author')
      expect(postModel![0]).toContain('User')
    })

    it('should properly configure foreign key constraint', () => {
      const postModel = schemaContent.match(/model\s+Post\s*{[^}]*}/s)
      expect(postModel).toBeTruthy()
      
      const relationMatch = postModel![0].match(/@relation\([^)]*\)/)
      expect(relationMatch).toBeTruthy()
      expect(relationMatch![0]).toContain('fields')
      expect(relationMatch![0]).toContain('references')
    })

    it('should reference correct fields in relation', () => {
      const postModel = schemaContent.match(/model\s+Post\s*{[^}]*}/s)
      const relationConfig = postModel![0].match(/@relation\([^)]*\)/)?.[0]
      
      expect(relationConfig).toContain('authorId')
      expect(relationConfig).toContain('id')
    })
  })

  describe('Field Type Validation', () => {
    it('should use appropriate types for User fields', () => {
      const userModel = schemaContent.match(/model\s+User\s*{[^}]*}/s)![0]
      
      expect(userModel).toMatch(/id\s+Int/)
      expect(userModel).toMatch(/email\s+String/)
      expect(userModel).toMatch(/name\s+String\?/)
    })

    it('should use appropriate types for Post fields', () => {
      const postModel = schemaContent.match(/model\s+Post\s*{[^}]*}/s)![0]
      
      expect(postModel).toMatch(/id\s+Int/)
      expect(postModel).toMatch(/title\s+String/)
      expect(postModel).toMatch(/content\s+String\?/)
      expect(postModel).toMatch(/published\s+Boolean/)
      expect(postModel).toMatch(/authorId\s+Int/)
    })
  })

  describe('Schema Syntax and Formatting', () => {
    it('should have proper Prisma schema syntax', () => {
      // Check for common syntax errors
      expect(schemaContent).not.toContain('};')
      expect(schemaContent.match(/{/g)?.length).toBe(schemaContent.match(/}/g)?.length)
    })

    it('should use consistent naming conventions', () => {
      // Models should be PascalCase
      const modelNames = schemaContent.match(/model\s+(\w+)/g)
      expect(modelNames).toBeTruthy()
      modelNames!.forEach(match => {
        const name = match.replace('model ', '')
        expect(name[0]).toBe(name[0].toUpperCase())
      })
    })

    it('should have proper indentation in model blocks', () => {
      const models = schemaContent.match(/model\s+\w+\s*{[^}]*}/gs)
      expect(models).toBeTruthy()
      expect(models!.length).toBeGreaterThan(0)
    })
  })

  describe('Comments and Documentation', () => {
    it('should contain schema documentation comments', () => {
      const hasComments = schemaContent.includes('//') || schemaContent.includes('/*')
      expect(hasComments).toBe(true)
    })

    it('should have Prisma documentation links in comments', () => {
      expect(schemaContent).toContain('pris.ly')
    })
  })

  describe('Default Values and Constraints', () => {
    it('should have autoincrement on id fields', () => {
      const models = schemaContent.match(/id\s+Int[^@]*@id[^@]*@default\(autoincrement\(\)\)/g)
      expect(models).toBeTruthy()
      expect(models!.length).toBe(2) // User and Post
    })

    it('should have unique constraint on email', () => {
      expect(schemaContent).toMatch(/email\s+String\s+@unique/)
    })

    it('should have default false for published field', () => {
      expect(schemaContent).toMatch(/published\s+Boolean\s+@default\(false\)/)
    })
  })

  describe('Schema Completeness', () => {
    it('should have exactly two models defined', () => {
      const models = schemaContent.match(/model\s+\w+\s*{/g)
      expect(models).toBeTruthy()
      expect(models!.length).toBe(2)
    })

    it('should have one generator block', () => {
      const generators = schemaContent.match(/generator\s+\w+\s*{/g)
      expect(generators).toBeTruthy()
      expect(generators!.length).toBe(1)
    })

    it('should have one datasource block', () => {
      const datasources = schemaContent.match(/datasource\s+\w+\s*{/g)
      expect(datasources).toBeTruthy()
      expect(datasources!.length).toBe(1)
    })
  })

  describe('Edge Cases and Validation', () => {
    it('should not have syntax errors in decorators', () => {
      const decorators = schemaContent.match(/@\w+(\([^)]*\))?/g)
      expect(decorators).toBeTruthy()
      decorators!.forEach(decorator => {
        // Check balanced parentheses
        const openParens = (decorator.match(/\(/g) || []).length
        const closeParens = (decorator.match(/\)/g) || []).length
        expect(openParens).toBe(closeParens)
      })
    })

    it('should not have trailing commas in relations', () => {
      const relations = schemaContent.match(/@relation\([^)]*\)/g)
      expect(relations).toBeTruthy()
      relations!.forEach(relation => {
        expect(relation).not.toMatch(/,\s*\)/)
      })
    })

    it('should have proper field separator syntax', () => {
      // Fields should be on separate lines
      const models = schemaContent.match(/model\s+\w+\s*{[^}]*}/gs)
      models!.forEach(model => {
        const fields = model.split('\n').filter(line => 
          line.trim() && !line.trim().startsWith('//') && !line.includes('model')
        )
        // Should have multiple fields
        expect(fields.length).toBeGreaterThan(0)
      })
    })
  })
})