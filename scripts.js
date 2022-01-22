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

	const ONE_SECOND = 1000;
	const ONE_MINUTE = 60 * 1000;
	const ONE_HOUR = 60 * 60 * 1000;
	const TIMER_SOUND = 'http://soundbible.com/grab.php?id=1252&type=mp3';

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
		const sec = secondDigit.textContent;
		const min = minuteDigit.textContent;
		const hr = hourDigit.textContent;
		return !Number(hr) && !Number(min) && !Number(sec);
	};

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
		console.log(Date.now(), 'Over');
	};

	let delta = 0; // to track lost time due to setInterval.
	let expected;

	const startCountdownTimer = () => {
		console.log(Date.now(), new Date());
		remainingTime = getRemainingTime(remainingTime); // in ms
		mask.style.animationPlayState = 'running';
		timerAnalog.style.animationPlayState = 'running';
		setDigits(remainingTime);
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
		modifyBtn.textContent = 'Start';
		isTimerRunning = false;
		isStarted = false;
		setDigits(initialTimeLimit);
		modifyBtn.disabled = false;
		timerAnalog.style.display = 'none';
		if (!initialTimeLimit) modifyBtn.disabled = true;
	};

	const handleStartStopBtn = () => {
		over.style.display = 'none';
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
		if (isTimerRunning) {
			isTimerRunning = false;
			modifyBtn.textContent = 'Start';
			clearTimeout(timerID);
			mask.style.animationPlayState = 'paused';
			timerAnalog.style.animationPlayState = 'paused';
		} else {
			timerAnalog.style.display = 'block';
			expected = Date.now() + 1000;
			timerID = setTimeout(startCountdownTimer, 1000);
			modifyBtn.textContent = 'Stop';
			isTimerRunning = true;
		}
	};

	const handleDigitChange = ({ target = {} }) => {
		if (isTimeZero()) {
			resetBtn.disabled = true;
			modifyBtn.disabled = true;
		} else {
			resetBtn.disabled = false;
			modifyBtn.disabled = false;
		}
	};

	const addEvents = () => {
		resetBtn.addEventListener('click', handleResetBtn);
		modifyBtn.addEventListener('click', handleStartStopBtn);
		hourDigit.addEventListener('input', handleDigitChange);
		minuteDigit.addEventListener('input', handleDigitChange);
		secondDigit.addEventListener('input', handleDigitChange);

		// HACK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		// !!!!!!!!!!!!!!!!
		// mask.addEventListener('webkitAnimationEnd', timeOver);
	};

	addEvents();

	// Initialize timeout sound
	timeoutAudio.src = TIMER_SOUND;
	timeoutAudio.load();
};

window.addEventListener('DOMContentReady', app());
