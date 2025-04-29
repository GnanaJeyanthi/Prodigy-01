document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const millisecondsElement = document.getElementById('milliseconds');
    const statusElement = document.getElementById('status');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const lapBtn = document.getElementById('lap-btn');
    const lapsList = document.getElementById('laps-list');
    const outerCircle = document.getElementById('outer-circle');
    const progressCircle = document.getElementById('progress-circle');
    
    // Variables
    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval = null;
    let lapCounter = 0;
    let lastLapTime = 0;
    let secondCounter = 0;
    const maxSeconds = 60; // For the progress ring
    
    // Update progress ring
    function updateProgressRing(seconds) {
        const value = seconds % 60;
        const circumference = 2 * Math.PI * 140; // 2πr where r=140
        const offset = circumference - (value / 60) * circumference;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = offset;
    }
    
    // Format time display
    function formatTimeDisplay(timeInMs) {
        const ms = Math.floor((timeInMs % 1000));
        const seconds = Math.floor((timeInMs / 1000) % 60);
        const minutes = Math.floor((timeInMs / (1000 * 60)) % 60);
        const hours = Math.floor((timeInMs / (1000 * 60 * 60)));
        
        hoursElement.textContent = String(hours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        secondsElement.textContent = String(seconds).padStart(2, '0');
        millisecondsElement.textContent = `.${String(ms).padStart(3, '0')}`;
        
        secondCounter = seconds;
        updateProgressRing(seconds);
        
        return { 
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0'),
            milliseconds: String(ms).padStart(3, '0')
        };
    }
    
    // Start the stopwatch
    function startStopwatch() {
        if (!timerInterval) {
            startTime = Date.now();
            timerInterval = setInterval(updateStopwatch, 10); // Update every 10ms
            statusElement.textContent = "Running";
            outerCircle.classList.add('pulse-animation');
        }
    }
    
    // Update stopwatch
    function updateStopwatch() {
        const currentTime = Date.now() - startTime + elapsedTime;
        formatTimeDisplay(currentTime);
    }
    
    // Pause the stopwatch
    function pauseStopwatch() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            elapsedTime += Date.now() - startTime;
            statusElement.textContent = "Paused";
            outerCircle.classList.remove('pulse-animation');
        }
    }
    
    // Reset the stopwatch
    function resetStopwatch() {
        pauseStopwatch();
        elapsedTime = 0;
        lapCounter = 0;
        lastLapTime = 0;
        formatTimeDisplay(0);
        statusElement.textContent = "Ready";
        lapsList.innerHTML = '<div class="empty-laps">No laps recorded</div>';
        updateProgressRing(0);
    }
    
    // Format time for display in lap list
    function formatTime(timeInMs) {
        const ms = Math.floor((timeInMs % 1000));
        const seconds = Math.floor((timeInMs / 1000) % 60);
        const minutes = Math.floor((timeInMs / (1000 * 60)) % 60);
        const hours = Math.floor((timeInMs / (1000 * 60 * 60)));
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
    }
    
    // Record lap time
    function recordLap() {
        if (timerInterval) {
            if (lapsList.querySelector('.empty-laps')) {
                lapsList.innerHTML = '';
            }
            
            const currentTime = Date.now() - startTime + elapsedTime;
            const lapTime = currentTime - lastLapTime;
            lastLapTime = currentTime;
            lapCounter++;
            
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            lapItem.innerHTML = `
                <div class="lap-number">Lap ${lapCounter}</div>
                <div class="lap-split">${formatTime(lapTime)}</div>
                <div class="lap-total">${formatTime(currentTime)}</div>
            `;
            
            lapsList.insertBefore(lapItem, lapsList.firstChild);
            
            // Animation effect for new lap
            setTimeout(() => {
                lapItem.style.background = 'rgba(139, 92, 246, 0.2)';
                setTimeout(() => {
                    lapItem.style.background = 'rgba(255, 255, 255, 0.03)';
                }, 300);
            }, 0);
        }
    }
    
    // Event listeners
    startBtn.addEventListener('click', startStopwatch);
    pauseBtn.addEventListener('click', pauseStopwatch);
    resetBtn.addEventListener('click', resetStopwatch);
    lapBtn.addEventListener('click', recordLap);
    
    // Initialize
    resetStopwatch();
});