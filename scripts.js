/**
 * 1. User will
 */

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
	let initialTimeLimit = null; // in ms.
	let remainingTime = null; // in ms.

	const padTime = (val) => {
		const appendedZero = '0' + Math.floor(val);
		const firstTwoChar = appendedZero.slice(-2);
		return firstTwoChar;
	};

	const getRemainingTime = (endTime = initialTimeLimit) => {
		return endTime - 1000;
	};

	let delta = 0;
	let expected;
	const startCountdownTimer = () => {
		// let remainingTime = initialTimeLimit; // in ms
		console.log(Date.now(), new Date());
		remainingTime = getRemainingTime(remainingTime); // in ms
		const seconds = padTime((remainingTime / 1000) % 60);
		const minutes = padTime((remainingTime / (60 * 1000)) % 60);
		const hours = padTime((remainingTime / (60 * 60 * 1000)) % 24);

		hourDigit.innerHTML = hours;
		minuteDigit.innerHTML = minutes;
		secondDigit.innerHTML = seconds;

		mask.style.animationPlayState = 'running';
		timerAnalog.style.animationPlayState = 'running';

		if (remainingTime >= 1000) {
			// initialTimeLimit = remainingTime;
		}

		if (remainingTime < 1000) {
			clearTimeout(timerID);
			timeoutAudio.play();
			isTimerRunning = false;
			modifyBtn.innerHTML = 'Start';
			timerAnalog.style.display = 'none';
			over.style.display = 'block';
			return;
			// tell user that time is over.
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
		timerAnalog.style.display = 'none';
		const seconds = padTime((initialTimeLimit / 1000) % 60);
		const minutes = padTime((initialTimeLimit / (60 * 1000)) % 60);
		const hours = padTime((initialTimeLimit / (60 * 60 * 1000)) % 24);

		hourDigit.innerHTML = hours;
		minuteDigit.innerHTML = minutes;
		secondDigit.innerHTML = seconds;
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

			mask.style.animationDuration = initialTimeLimit / 1000 + 's';
			timerAnalog.style.animationDuration = initialTimeLimit / 1000 + 's';
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

	const handleDigitChange = (event) => {
		const { target = {} } = event;
		console.log(target, 'digit event');
		let value = target.innerText;
		if (value.length < 2) return;
		target.innerText = value ? padTime(value.slice(0, 2)) : '00';
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

function timeChanged(ev) {
	console.log(ev, 'ev');
}
