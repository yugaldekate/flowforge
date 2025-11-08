# Test Suite

This directory contains comprehensive unit tests for the FlowForge application.

## Test Structure

- `lib/` - Tests for library utilities and database connections
- `app/` - Tests for Next.js app components
- `setup.ts` - Global test configuration and setup

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Test Coverage

The test suite covers:
- Database connection singleton pattern
- Prisma configuration
- Schema validation
- Environment-specific behavior
- Edge cases and error handling

## Writing New Tests

Follow these guidelines when adding tests:
1. Use descriptive test names
2. Group related tests using `describe` blocks
3. Test both happy paths and edge cases
4. Mock external dependencies
5. Clean up after tests using `afterEach`