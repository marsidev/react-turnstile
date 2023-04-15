import { cleanup } from '@testing-library/react'
import matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
	cleanup()
})
