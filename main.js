const app = () => {
	const hourDigit = document.getElementById('hourDigit');
	const minuteDigit = document.getElementById('minuteDigit');
	const secondDigit = document.getElementById('secondDigit');
	const resetBtn = document.getElementById('reset');
	const modifyBtn = document.getElementById('modify');
	const timeoutAudio = document.getElementById('timeoutAudio');
	const mask = document.querySelector('.mask');
	const timerAnalog = document.querySelector('.timer-analog');
	const over = document.querySelector('.over');

	const ONE_SECOND = 1000;
	const ONE_MINUTE = 60 * 1000;
	const ONE_HOUR = 60 * 60 * 1000;
	const TIMER_SOUND = 'http://soundbible.com/grab.php?id=1252&type=mp3';

	let isStarted = false;
	let isTimerRunning = false;
	let timerID = null;
	let initialTimeLimit = null;
	let remainingTime = null;

	const padTime = (val) => {
		const appendedZero = '0' + Math.floor(val);
		const firstTwoChar = appendedZero.slice(-2);
		return firstTwoChar;
	};

	// subtract one second.
	const getRemainingTime = (endTime = initialTimeLimit) => endTime - 1000;

	// check if entered time is 00:00:00
	const isTimeZero = () => {
		const sec = secondDigit.textContent;
		const min = minuteDigit.textContent;
		const hr = hourDigit.textContent;
		return !Number(hr) && !Number(min) && !Number(sec);
	};

	// set the timer digits
	const setDigits = (time) => {
		const seconds = padTime((time / ONE_SECOND) % 60);
		const minutes = padTime((time / ONE_MINUTE) % 60);
		let hours = Math.floor(time / ONE_HOUR).toString();
		if (hours.length === 1) {
			hours = '0' + hours;
		}

		hourDigit.textContent = hours;
		minuteDigit.textContent = minutes;
		secondDigit.textContent = seconds;
	};

	const timeOver = () => {
		clearTimeout(timerID);
		timeoutAudio.play();
		isTimerRunning = false;
		modifyBtn.textContent = 'Start';
		timerAnalog.style.display = 'none';
		over.style.display = 'block';
		modifyBtn.disabled = true;
		isStarted = false;
	};

	let delta = 0; // to track lost time due to setInterval.
	let expected;

	const startCountdownTimer = () => {
		remainingTime = getRemainingTime(remainingTime); // in ms
		mask.style.animationPlayState = 'running';
		timerAnalog.style.animationPlayState = 'running';
		setDigits(remainingTime);
		if (remainingTime < 1000) {
			timeOver();
			return;
		}
		// to account for lost time due to setTimeout
		delta = Date.now() - expected;
		expected = expected + 1000;
		// 1000 - delta to make sure timer adjusts for lost time.
		timerID = setTimeout(startCountdownTimer, 1000 - delta);
	};

	const handleResetBtn = () => {
		clearTimeout(timerID);
		over.style.display = 'none';
		modifyBtn.textContent = 'Start';
		isTimerRunning = false;
		isStarted = false;
		setDigits(initialTimeLimit);
		modifyBtn.disabled = false;
		timerAnalog.style.display = 'none';
		if (!initialTimeLimit) modifyBtn.disabled = true;
	};

	// triggered on Start / Stop button click.
	const handleStartStopBtn = () => {
		over.style.display = 'none';
		// Started for the first time.
		if (!isStarted) {
			initialTimeLimit =
				secondDigit.textContent * ONE_SECOND +
				minuteDigit.textContent * ONE_MINUTE +
				hourDigit.textContent * ONE_HOUR;

			mask.style.animationPlayState = 'running';
			timerAnalog.style.animationPlayState = 'running';

			mask.style.animationDuration = `${initialTimeLimit / ONE_SECOND}s`;
			timerAnalog.style.animationDuration = `${initialTimeLimit / ONE_SECOND}s`;
			remainingTime = initialTimeLimit;
		}
		isStarted = true;
		// Pause
		if (isTimerRunning) {
			isTimerRunning = false;
			modifyBtn.textContent = 'Start';
			clearTimeout(timerID);
			mask.style.animationPlayState = 'paused';
			timerAnalog.style.animationPlayState = 'paused';
		}
		// Play
		else {
			timerAnalog.style.display = 'block';
			expected = Date.now() + 1000;
			timerID = setTimeout(startCountdownTimer, 1000);
			modifyBtn.textContent = 'Stop';
			isTimerRunning = true;
		}
	};

	const handleDigitChange = () => {
		if (isTimeZero()) {
			resetBtn.disabled = true;
			modifyBtn.disabled = true;
		} else {
			resetBtn.disabled = false;
			modifyBtn.disabled = false;
		}
	};

	// Disallow non numerics
	const allowNumbers = (ev) => {
		if (isNaN(String.fromCharCode(ev.which)) || ev.which === 13) {
			ev.preventDefault();
		}
	};

	// Event handlers
	const addEvents = () => {
		resetBtn.addEventListener('click', handleResetBtn);
		modifyBtn.addEventListener('click', handleStartStopBtn);
		hourDigit.addEventListener('input', handleDigitChange);
		minuteDigit.addEventListener('input', handleDigitChange);
		secondDigit.addEventListener('input', handleDigitChange);

		hourDigit.addEventListener('keypress', allowNumbers);
		minuteDigit.addEventListener('keypress', allowNumbers);
		secondDigit.addEventListener('keypress', allowNumbers);
	};

	addEvents();

	// Initialize timeout sound
	timeoutAudio.src = TIMER_SOUND;
	timeoutAudio.load();
};

window.addEventListener('DOMContentReady', app());
