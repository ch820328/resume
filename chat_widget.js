document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const closeBtn = document.getElementById('chat-close-btn');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');

    // Toggle Chat Window
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // Helper: Add Message to Chat
    function appendMessage(isUser, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${isUser ? 'user-message' : 'ai-message'}`;
        msgDiv.textContent = text;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll
    }

    // Send Message Logic
    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Show user message
        appendMessage(true, text);
        chatInput.value = '';
        chatInput.disabled = true;
        sendBtn.disabled = true;

        // 2. Show loading
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.className = 'chat-message ai-message loading';
        loadingDiv.textContent = 'Typing...';
        chatBody.appendChild(loadingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            // 3. Call RAG API (using dynamic hostname to fix network issues)
            const apiUrl = `http://${window.location.hostname}:46579/chat`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();

            // Remove loading
            document.getElementById(loadingId).remove();

            // Show AI response
            if (data.reply) {
                appendMessage(false, data.reply);
                // Optionally show sources
                // if (data.sources && data.sources.length > 0) {
                //    appendMessage(false, `(Sources: ${data.sources.join(', ')})`);
                // }
            } else {
                appendMessage(false, "Oops, I couldn't process that.");
            }

        } catch (error) {
            document.getElementById(loadingId).remove();
            appendMessage(false, "Error: Could not reach the AI backend (is it running?).");
        } finally {
            chatInput.disabled = false;
            sendBtn.disabled = false;
            chatInput.focus();
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});
