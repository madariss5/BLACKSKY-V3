/**
 * GitHub Direct Editing Test Script
 * This script tests editing a file directly on GitHub via API
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');
require('dotenv').config();

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'madariss5'; // Replace with your GitHub username
const REPO = 'BLACKSKY'; // Replace with your repository name
const TEST_FILE_PATH = 'test-file.md'; // Path to create/edit in the repository

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[34m', // Blue
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    reset: '\x1b[0m', // Reset
    bold: '\x1b[1m', // Bold
    cyan: '\x1b[36m', // Cyan
  };

  const prefix = {
    info: '[INFO]',
    success: '[SUCCESS]',
    warning: '[WARNING]',
    error: '[ERROR]',
  };

  console.log(`${colors[type]}${prefix[type]} ${message}${colors.reset}`);
}

// Make a request to the GitHub API
function makeGitHubRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${OWNER}/${REPO}${endpoint}`,
      method: method,
      headers: {
        'User-Agent': 'GitHub-API-Test',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsedData = responseData ? JSON.parse(responseData) : {};
            resolve(parsedData);
          } catch (e) {
            resolve(responseData);
          }
        } else {
          reject({
            statusCode: res.statusCode,
            message: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Get the file content from GitHub (if it exists)
async function getFileContent(filePath) {
  try {
    const response = await makeGitHubRequest(`/contents/${filePath}`);
    const content = Buffer.from(response.content, 'base64').toString('utf8');
    return {
      content,
      sha: response.sha
    };
  } catch (error) {
    if (error.statusCode === 404) {
      return { content: null, sha: null };
    }
    throw error;
  }
}

// Create or update a file on GitHub
async function createOrUpdateFile(filePath, content, message, sha = null) {
  const data = {
    message,
    content: Buffer.from(content).toString('base64'),
  };

  if (sha) {
    data.sha = sha;
  }

  try {
    const response = await makeGitHubRequest(`/contents/${filePath}`, 'PUT', data);
    return response;
  } catch (error) {
    console.error('Error creating/updating file:', error);
    throw error;
  }
}

// Delete a file from GitHub
async function deleteFile(filePath, sha, message) {
  const data = {
    message,
    sha
  };

  try {
    const response = await makeGitHubRequest(`/contents/${filePath}`, 'DELETE', data);
    return response;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

// Verify GitHub token
async function verifyGitHubToken() {
  try {
    const response = await makeGitHubRequest('', 'GET');
    log(`Token verification successful. Repository: ${response.name}`, 'success');
    return true;
  } catch (error) {
    log(`Token verification failed: ${error.message}`, 'error');
    return false;
  }
}

// Main function
async function main() {
  console.log('\x1b[36;1m' + '='.repeat(48));
  console.log('       GitHub Editing Test Script        ');
  console.log('='.repeat(48) + '\x1b[0m');

  // Check if GitHub token exists
  if (!GITHUB_TOKEN) {
    log('GitHub token not found. Please set the GITHUB_TOKEN environment variable.', 'error');
    return;
  }

  // Verify GitHub token
  const isTokenValid = await verifyGitHubToken();
  if (!isTokenValid) {
    log('Please check your GitHub token and permissions.', 'error');
    return;
  }

  // Test file operations
  try {
    // 1. Check if file exists and get content if it does
    log(`Checking if ${TEST_FILE_PATH} exists...`);
    const { content, sha } = await getFileContent(TEST_FILE_PATH);
    
    // 2. Create or update the file
    const newContent = `# Test File\n\nThis is a test file created by the GitHub editing test script at ${new Date().toISOString()}\n\nIf you see this file, the GitHub API editing is working correctly!`;
    
    if (content === null) {
      log(`Creating new file: ${TEST_FILE_PATH}...`);
      await createOrUpdateFile(TEST_FILE_PATH, newContent, 'Create test file via API');
      log(`File created successfully!`, 'success');
    } else {
      log(`Updating existing file: ${TEST_FILE_PATH}...`);
      await createOrUpdateFile(TEST_FILE_PATH, newContent, 'Update test file via API', sha);
      log(`File updated successfully!`, 'success');
    }
    
    // 3. Delete the file after a short delay
    log(`Waiting 5 seconds before deleting the test file...`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const { sha: currentSha } = await getFileContent(TEST_FILE_PATH);
    log(`Deleting file: ${TEST_FILE_PATH}...`);
    await deleteFile(TEST_FILE_PATH, currentSha, 'Delete test file via API');
    log(`File deleted successfully!`, 'success');
    
    log('All GitHub API operations completed successfully!', 'success');
    log('You should be able to edit files on GitHub using the API.', 'success');
    log('If you still cannot edit files through the web interface, please try the suggestions in the GITHUB_EDITING_GUIDE.md file.', 'info');
  } catch (error) {
    log(`Error during file operations: ${JSON.stringify(error)}`, 'error');
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
});