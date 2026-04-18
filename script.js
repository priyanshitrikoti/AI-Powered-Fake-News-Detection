class FakeNewsDetectorApp {
    constructor() {
        this.apiUrl = 'http://127.0.0.1:5000/api';
        this.init();
    }

    init() {
        this.bindEvents();
        this.hideLoading();
        this.updateLiveStats();
        this.loadDemoText();
    }

    bindEvents() {
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeNews());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearResults());
        
        document.getElementById('newsText').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.analyzeNews();
        });

        window.addEventListener('scroll', () => this.handleScroll());
    }

    async analyzeNews() {
        const textInput = document.getElementById('newsText');
        const text = textInput.value.trim();
        const analyzeBtn = document.getElementById('analyzeBtn');
        const resultPanel = document.getElementById('resultPanel');
        
        // 1. EMPTY BOX CHECK
        if (text === "") {
            this.showError('Box is empty! Please paste some news.');
            textInput.focus();
            return;
        }

        // 2. INVALID INPUT CHECK (Only Numbers or Special Characters)
        // Agar text mein kam se kam ek letter (A-Z) nahi hai, toh error dikhao
        const hasLetters = /[a-zA-Z]/.test(text);
        if (!hasLetters) {
            this.showError('Invalid input! Please enter actual news text, not just numbers or symbols.');
            return;
        }

        // 3. INCOMPLETE NEWS CHECK (Minimum length for better AI Accuracy)
        // Adhi adhuri news ke liye 40-50 characters zaroori hain
        if (text.length < 50) {
            this.showError('This news seems incomplete. Please provide more context for accurate analysis.');
            return;
        }

        // UI Reset & Loading State
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        resultPanel.classList.remove('hidden');
        
        // Processing State UI
        this.resetUIState('AI is processing...', '#6b7280', '<i class="fas fa-microchip fa-pulse"></i> ');

        try {
            const response = await fetch(`${this.apiUrl}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error('API Error');

            const result = await response.json();
            this.displayResult(result);
            this.updateLiveStats();

        } catch (error) {
            console.error('Analysis error:', error);
            this.showError('Connection failed! Check if Flask server is running.');
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<i class="fas fa-brain"></i> Analyze with AI';
        }
    }

    displayResult(result) {
        const prediction = result.prediction.toUpperCase();
        const badge = document.getElementById('predictionBadge');
        const resultPanel = document.getElementById('resultPanel');
        
        // Style reset
        badge.style.background = ""; 

        // logic based badge update
        if (prediction === 'FAKE') {
            badge.className = 'prediction-badge fake';
            badge.innerHTML = `<i class="fas fa-times-circle"></i> FAKE NEWS`;
        } else if (prediction === 'REAL') {
            badge.className = 'prediction-badge real';
            badge.innerHTML = `<i class="fas fa-check-circle"></i> REAL NEWS`;
        } else {
            badge.className = 'prediction-badge mixed';
            badge.innerHTML = `<i class="fas fa-exclamation-triangle"></i> MIXED / UNVERIFIED`;
        }

        // Probability and Accuracy Bars Update
        const realProb = parseFloat(result.real_probability);
        const fakeProb = parseFloat(result.fake_probability);

        document.getElementById('realProb').textContent = `${realProb}%`;
        document.getElementById('fakeProb').textContent = `${fakeProb}%`;
        document.getElementById('realProbFill').style.width = `${realProb}%`;
        document.getElementById('fakeProbFill').style.width = `${fakeProb}%`;

        // Overall Confidence
        document.getElementById('confidenceLabel').textContent = `${result.confidence}%`;
        document.getElementById('confidenceFill').style.width = `${result.confidence}%`;

        // Technical Details
        document.getElementById('processingTime').textContent = `${result.processing_time_ms}ms`;
        document.getElementById('textLength').textContent = `${result.text_length} chars`;

        resultPanel.style.transform = 'translateY(0)';
        resultPanel.style.opacity = '1';
    }

    // Naya helper function reset ke liye
    resetUIState(text, color, icon) {
        const badge = document.getElementById('predictionBadge');
        badge.innerHTML = icon + text;
        badge.style.background = color;
        badge.className = 'prediction-badge';
        
        // Reset bars to initial state
        document.getElementById('realProb').textContent = '0%';
        document.getElementById('fakeProb').textContent = '0%';
        document.getElementById('realProbFill').style.width = '0%';
        document.getElementById('fakeProbFill').style.width = '0%';
    }

    showError(message) {
        const resultPanel = document.getElementById('resultPanel');
        const badge = document.getElementById('predictionBadge');
        
        resultPanel.classList.remove('hidden');
        badge.style.background = "#ef4444"; 
        badge.className = 'prediction-badge';
        badge.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Update bars to zero on error
        document.getElementById('confidenceLabel').textContent = '0%';
        document.getElementById('confidenceFill').style.width = '0%';
        
        setTimeout(() => {
            if (badge.innerHTML.includes(message)) {
                resultPanel.classList.add('hidden');
            }
        }, 4000);
    }

    clearResults() {
        document.getElementById('newsText').value = '';
        document.getElementById('resultPanel').classList.add('hidden');
    }

    updateLiveStats() {
        fetch(`${this.apiUrl}/stats`)
            .then(res => res.json())
            .then(data => {
                document.getElementById('livePredictions').textContent = data.total_predictions.toLocaleString();
            })
            .catch(() => {});
    }

    hideLoading() {
        const screen = document.getElementById('loadingScreen');
        if(screen) {
            setTimeout(() => {
                screen.style.opacity = '0';
                setTimeout(() => screen.style.display = 'none', 500);
            }, 2000);
        }
    }

    handleScroll() {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    }

    loadDemoText() {
        const demoTexts = [
            "Government to launch new AI scholarship for students.",
            "SHOCKING: Aliens found a secret base inside the Moon!",
            "New research shows coffee improves focus and brain health.",
            "BREAKING: Magic water found that cures everything instantly!"
        ];
        const randomText = demoTexts[Math.floor(Math.random() * demoTexts.length)];
        document.getElementById('newsText').placeholder = `Example: ${randomText}`;
    }
}

document.addEventListener('DOMContentLoaded', () => new FakeNewsDetectorApp());