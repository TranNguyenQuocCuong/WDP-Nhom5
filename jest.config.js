module.exports = {
    // Use Babel for transforming files
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
  
    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  
    // A list of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: ["/node_modules/", "/build/"],
  
    // An array of file extensions your modules use
    moduleFileExtensions: ["js", "jsx", "tsx"],
  
    // The test environment that will be used for testing
    testEnvironment: "jsdom",
  
    // Module name mapper for handling static assets and CSS imports
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "\\.(gif|ttf|eot|svg)$": "<rootDir>/src/__mocks__/fileMock.js"
    }
  };