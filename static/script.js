// ============================================
// AI IDE - Main JavaScript File
// Monaco Editor, API Integration, and UI Controls
// ============================================

// Global Variables
let monacoEditor;
let currentTheme = 'dark';
let currentDir = 'ltr';
let selectedAIAction = null;

// ============================================
// Monaco Editor Initialization
// ============================================
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });

window.MonacoEnvironment = {
    getWorkerUrl: function (workerId, label) {
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = {
                baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/'
            };
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/base/worker/workerMain.min.js');
        `)}`;
    }
};

require(['vs/editor/editor.main'], function () {
    monacoEditor = monaco.editor.create(document.getElementById('monacoEditor'), {
        value: '# Welcome to AI IDE\n# Write your Python code here\n\nprint("Hello, World!")\n',
        language: 'python',
        theme: 'vs-dark',
        fontSize: 14,
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        tabSize: 4,
    });

    // Initialize UI after Monaco is loaded
    initializeUI();
});

// ============================================
// UI Initialization
// ============================================
function initializeUI() {
    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Direction Toggle
    document.getElementById('dirToggle').addEventListener('click', toggleDirection);

    // Run Button
    document.getElementById('runBtn').addEventListener('click', runPython);

    // Clear Code Button
    document.getElementById('clearCodeBtn').addEventListener('click', clearCode);

    // Clear Output Button
    document.getElementById('clearOutputBtn').addEventListener('click', clearOutput);

    // Clear AI Output Button
    document.getElementById('clearAiOutputBtn').addEventListener('click', clearAiOutput);

    // Send Prompt Button
    document.getElementById('sendPromptBtn').addEventListener('click', sendAIPrompt);

    // AI Action Buttons
    document.querySelectorAll('.btn-ai').forEach(button => {
        button.addEventListener('click', function () {
            selectedAIAction = this.getAttribute('data-action');
            // Highlight selected action
            document.querySelectorAll('.btn-ai').forEach(btn => btn.style.opacity = '1');
            this.style.opacity = '0.7';
            updateStatus('AI Action selected: ' + selectedAIAction);
        });
    });

    // Resizer Functionality
    initializeResizer();

    // Load saved theme preference
    loadThemePreference();

    console.log('AI IDE initialized successfully!');
}

// ============================================
// Theme Toggle
// ============================================
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.classList.toggle('light-mode');

    // Update Monaco theme
    if (monacoEditor) {
        monaco.editor.setTheme(currentTheme === 'dark' ? 'vs-dark' : 'vs');
    }

    // Update theme icon
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = currentTheme === 'dark' ? '🌙' : '☀️';

    // Save preference
    localStorage.setItem('theme', currentTheme);

    updateStatus(`Theme changed to ${currentTheme} mode`);
}

// ============================================
// Direction Toggle (RTL/LTR)
// ============================================
function toggleDirection() {
    currentDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', currentDir);
    const htmlElement = document.querySelector('html');
    htmlElement.setAttribute('lang', currentDir === 'rtl' ? 'ar' : 'en');

    // Update text content based on direction
    updateTextContent();

    updateStatus(`Direction changed to ${currentDir.toUpperCase()}`);
}

// ============================================
// Update Text Content for RTL/LTR
// ============================================
function updateTextContent() {
    const elements = document.querySelectorAll('[data-en]');
    elements.forEach(el => {
        if (currentDir === 'rtl' && el.hasAttribute('data-ar')) {
            el.textContent = el.getAttribute('data-ar');
        } else if (currentDir === 'ltr' && el.hasAttribute('data-en')) {
            el.textContent = el.getAttribute('data-en');
        }
    });
}

// ============================================
// Run Python Code
// ============================================
async function runPython() {
    const code = monacoEditor.getValue();
    const inputsText = document.getElementById('runtimeInputs').value;
    const inputs = inputsText.split('\n').filter(line => line.trim() !== '');

    if (!code.trim()) {
        showOutput('Error: No code to execute!', true);
        return;
    }

    showLoading(true);
    updateStatus('Running Python code...');

    try {
        const response = await fetch('/api/code/run_python', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code,
                inputs: inputs
            })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.error) {
                showOutput('Error:\n' + data.error, true);
            } else {
                showOutput(data.output || 'Code executed successfully!');
            }
        } else {
            showOutput('Error: ' + (data.error || 'Failed to execute code'), true);
        }
    } catch (error) {
        showOutput('Error: ' + error.message, true);
        console.error('Error running code:', error);
    } finally {
        showLoading(false);
        updateStatus('Ready');
    }
}

// ============================================
// Send AI Prompt
// ============================================
async function sendAIPrompt() {
    const prompt = document.getElementById('aiPrompt').value.trim();

    // CRITICAL: Rigorous client-side validation
    if (!selectedAIAction) {
        showAIOutput('الرجاء اختيار إجراء AI أولاً!', true);
        return;
    }

    // Validate based on action type
    if (['check_and_fix', 'improve_code'].includes(selectedAIAction)) {
        // For code-related actions, check if editor has code
        const currentCode = monacoEditor.getValue().trim();
        if (!currentCode || currentCode.length === 0) {
            showAIOutput('الرجاء إدخال كود في المحرر قبل استخدام هذا الإجراء.', true);
            return;
        }
    } else {
        // For generate_code or chat_response, check if prompt is provided
        if (!prompt || prompt.length === 0) {
            showAIOutput('الرجاء إدخال نص أو طلب صالح قبل الإرسال.', true);
            return;
        }
    }

    showLoading(true);
    updateStatus('Processing AI request...');

    // Add user message to chat
    addChatMessage('user', prompt || 'طلب ' + selectedAIAction);

    try {
        const requestBody = {
            action: selectedAIAction,
            prompt: prompt || monacoEditor.getValue() // Use code if no prompt for code actions
        };

        // For code-related actions, include the current code
        if (['check_and_fix', 'improve_code'].includes(selectedAIAction)) {
            requestBody.code = monacoEditor.getValue();
        }

        const response = await fetch('/api/ai/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (response.ok) {
            const aiResponse = data.response || data.code || 'AI response received.';
            showAIOutput(aiResponse);
            addChatMessage('ai', aiResponse);

            // If it's generate_code action and we got code, offer to insert it
            if (selectedAIAction === 'generate_code' && data.code) {
                if (confirm('Would you like to insert this code into the editor?')) {
                    monacoEditor.setValue(data.code);
                }
            }

            // Clear prompt after successful response
            document.getElementById('aiPrompt').value = '';
        } else {
            const errorMsg = data.error || 'Failed to get AI response';
            showAIOutput('Error: ' + errorMsg, true);
            addChatMessage('ai', 'Error: ' + errorMsg);
        }
    } catch (error) {
        showAIOutput('Error: ' + error.message, true);
        addChatMessage('ai', 'Error: ' + error.message);
        console.error('Error sending AI prompt:', error);
    } finally {
        showLoading(false);
        updateStatus('Ready');
    }
}

// ============================================
// Clear Functions
// ============================================
function clearCode() {
    if (confirm('Are you sure you want to clear the code?')) {
        monacoEditor.setValue('');
        updateStatus('Code cleared');
    }
}

function clearOutput() {
    document.getElementById('outputConsole').textContent = '';
    updateStatus('Output cleared');
}

function clearAiOutput() {
    document.getElementById('aiOutput').innerHTML = '';
    updateStatus('AI output cleared');
}

// ============================================
// Display Functions
// ============================================
function showOutput(text, isError = false) {
    const outputConsole = document.getElementById('outputConsole');
    outputConsole.textContent = text;
    outputConsole.className = isError ? 'error-text' : 'success-text';
    outputConsole.scrollTop = outputConsole.scrollHeight;
}

function showAIOutput(text, isError = false) {
    const aiOutput = document.getElementById('aiOutput');
    
    // Format the output with basic HTML
    const formattedText = text
        .replace(/\n/g, '<br>')
        .replace(/```([\s\S]*?)```/g, '<pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; overflow-x: auto;">$1</pre>')
        .replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">$1</code>');
    
    aiOutput.innerHTML = formattedText;
    aiOutput.className = 'ai-output-content ' + (isError ? 'error-text' : '');
    aiOutput.scrollTop = aiOutput.scrollHeight;
}

function addChatMessage(sender, message) {
    const chatHistory = document.getElementById('chatHistory');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'chat-message-label';
    labelDiv.textContent = sender === 'user' ? 'You' : 'AI Assistant';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'chat-message-text';
    textDiv.textContent = message.length > 200 ? message.substring(0, 200) + '...' : message;
    
    messageDiv.appendChild(labelDiv);
    messageDiv.appendChild(textDiv);
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function updateStatus(message) {
    const statusText = document.querySelector('.status-text');
    const originalText = statusText.textContent;
    statusText.textContent = message;
    
    // Reset to original after 3 seconds
    setTimeout(() => {
        statusText.textContent = currentDir === 'rtl' ? 'جاهز' : 'Ready';
    }, 3000);
}

// ============================================
// Loading Overlay
// ============================================
function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (show) {
        loadingOverlay.classList.add('active');
    } else {
        loadingOverlay.classList.remove('active');
    }
}

// ============================================
// Resizer Functionality
// ============================================
function initializeResizer() {
    const resizer = document.getElementById('resizer');
    const editorSection = document.querySelector('.editor-section');
    const aiSection = document.querySelector('.ai-section');
    let isResizing = false;

    resizer.addEventListener('mousedown', function (e) {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function (e) {
        if (!isResizing) return;

        const containerWidth = document.querySelector('.main-container').offsetWidth;
        const newEditorWidth = e.clientX - editorSection.getBoundingClientRect().left;
        const newAIWidth = containerWidth - newEditorWidth - 10; // 10 for resizer

        if (newEditorWidth > 400 && newAIWidth > 300) {
            editorSection.style.flex = `0 0 ${newEditorWidth}px`;
            aiSection.style.width = `${newAIWidth}px`;
        }
    });

    document.addEventListener('mouseup', function () {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        }
    });
}

// ============================================
// Load Theme Preference
// ============================================
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== currentTheme) {
        toggleTheme();
    }
}

// ============================================
// Keyboard Shortcuts
// ============================================
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + Enter to run code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runPython();
    }

    // Ctrl/Cmd + Shift + K to clear code
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        clearCode();
    }

    // Ctrl/Cmd + Shift + L to clear output
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        clearOutput();
    }
});

// ============================================
// Console Log for Debugging
// ============================================
console.log('%c AI IDE Loaded Successfully! ', 'background: #6366f1; color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px; font-weight: bold;');
console.log('%c Keyboard Shortcuts:', 'color: #8b5cf6; font-size: 14px; font-weight: bold;');
console.log('  • Ctrl/Cmd + Enter: Run code');
console.log('  • Ctrl/Cmd + Shift + K: Clear code');
console.log('  • Ctrl/Cmd + Shift + L: Clear output');
