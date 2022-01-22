const app = () => {
	const hourDigit = document.getElementById('hourDigit');
	const minuteDigit = document.getElementById('minuteDigit');
	const secondDigit = document.getElementById('secondDigit');
	const resetBtn = document.getElementById('reset');
	const modifyBtn = document.getElementById('modify');
	const timeoutAudio = document.getElementById('timeout_audio');

	const mask = document.querySelector('.mask');
	const timerAnalog = document.querySelector('.timer-analog');
	const over = document.querySelector('.over');

	let isStarted = false;
	let isTimerRunning = false;
	let timerID;
	let initialTimeLimit = null;
	let remainingTime = null;

	const padTime = (val) => {
		const appendedZero = '0' + Math.floor(val);
		const firstTwoChar = appendedZero.slice(-2);
		return firstTwoChar;
	};

	const getRemainingTime = (endTime = initialTimeLimit) => endTime - 1000;

	const isTimeZero = () => {
		const sec = secondDigit.innerHTML;
		const min = minuteDigit.innerHTML;
		const hr = hourDigit.innerHTML;
		return !Number(hr) && !Number(min) && !Number(sec);
	};

	const setDigits = (time) => {
		const seconds = padTime((time / 1000) % 60);
		const minutes = padTime((time / (60 * 1000)) % 60);
		let hours = Math.floor(time / (60 * 60 * 1000)).toString();
		if (hours.length === 1) {
			hours = '0' + hours;
		}
		hourDigit.innerHTML = hours;
		minuteDigit.innerHTML = minutes;
		secondDigit.innerHTML = seconds;
	};

	const timeOver = () => {
		clearTimeout(timerID);
		timeoutAudio.play();
		isTimerRunning = false;
		modifyBtn.innerHTML = 'Start';
		timerAnalog.style.display = 'none';
		over.style.display = 'block';
		modifyBtn.disabled = true;
		isStarted = false;
	};

	let delta = 0; // to track lost time due to setInterval.
	let expected;

	const startCountdownTimer = () => {
		console.log(Date.now(), new Date());
		remainingTime = getRemainingTime(remainingTime); // in ms
		setDigits(remainingTime);

		mask.style.animationPlayState = 'running';
		timerAnalog.style.animationPlayState = 'running';

		if (remainingTime < 1000) {
			timeOver();
			return;
		}
		delta = Date.now() - expected;
		expected = expected + 1000;
		timerID = setTimeout(startCountdownTimer, 1000 - delta);
	};

	const handleResetBtn = () => {
		clearTimeout(timerID);
		over.style.display = 'none';
		modifyBtn.innerHTML = 'Start';
		isTimerRunning = false;
		mask.style.animationDirection = 'forwards';
		timerAnalog.style.animationDirection = 'forwards';
		mask.style.animationPlayState = 'paused';
		timerAnalog.style.animationPlayState = 'paused';
		isStarted = false;
		setDigits(initialTimeLimit);
		modifyBtn.disabled = false;
		timerAnalog.style.display = 'none';
	};

	const handleStartStopBtn = () => {
		over.style.display = 'none';
		if (!isStarted) {
			initialTimeLimit =
				secondDigit.innerHTML * 1000 +
				minuteDigit.innerHTML * 60 * 1000 +
				hourDigit.innerHTML * 60 * 60 * 1000;

			mask.style.animationPlayState = 'running';
			timerAnalog.style.animationPlayState = 'running';

			mask.style.animationDuration = `${initialTimeLimit / 1000}s`;
			timerAnalog.style.animationDuration = `${initialTimeLimit / 1000}s`;
			remainingTime = initialTimeLimit;
		}
		isStarted = true;
		if (isTimerRunning) {
			mask.style.animationPlayState = 'paused';
			timerAnalog.style.animationPlayState = 'paused';
			isTimerRunning = false;
			modifyBtn.innerHTML = 'Start';
			clearTimeout(timerID);
		} else {
			timerAnalog.style.display = 'block';
			expected = Date.now() + 1000;
			timerID = setTimeout(startCountdownTimer, 1000);
			modifyBtn.innerHTML = 'Stop';
			isTimerRunning = true;
		}
	};

	const handleDigitChange = (event = {}) => {
		const { target = {} } = event;
		let value = target.innerText;
		if (isTimeZero()) {
			resetBtn.disabled = true;
			modifyBtn.disabled = true;
		} else {
			resetBtn.disabled = false;
			modifyBtn.disabled = false;
		}
		if (value.length < 2) return;
		// target.innerText = value ? padTime(value.slice(0, 2)) : '00';
	};

	const addEvents = () => {
		resetBtn.addEventListener('click', handleResetBtn);
		modifyBtn.addEventListener('click', handleStartStopBtn);
		hourDigit.addEventListener('input', handleDigitChange);
		minuteDigit.addEventListener('input', handleDigitChange);
		secondDigit.addEventListener('input', handleDigitChange);
	};

	addEvents();

	// Initialize timeout sound
	timeoutAudio.src = 'http://soundbible.com/grab.php?id=1252&type=mp3';
	timeoutAudio.load();
};

window.addEventListener('DOMContentReady', app());
