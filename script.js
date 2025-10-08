// Water Trivia Tower Matching Game
// This code makes the game interactive for beginners using only DOM-based JavaScript.
// It shuffles cards, checks for matches, and includes a timer.

document.addEventListener("DOMContentLoaded", () => {
	// --- LEVEL DATA ---
	const levels = [
		{
			pairs: [
				["borehole", "deep water access"],
				["Ethiopia", "charity: water project"],
				["well", "groundwater"],
				["water pump", "clean water"]
			],
			time: 60,
			hints: 2
		},
		{
			pairs: [
				["latrine", "sanitation"],
				["filter", "purification"],
				["handwashing", "hygiene"],
				["rainwater", "collection"],
				["Africa", "Asia"]
			],
			time: 70,
			hints: 2
		},
		{
			pairs: [
				["pipeline", "distribution"],
				["solar pump", "renewable energy"],
				["maintenance", "sustainability"],
				["community", "ownership"],
				["training", "education"],
				["monitoring", "impact"]
			],
			time: 80,
			hints: 1
		}
	];

	let currentLevel = 0;
	let score = 0;
	let combo = 0;
	let maxCombo = 0;
	let hintsLeft = 0;
	let seconds = 0;
	let matchedPairs = 0;
	let firstCard = null;
	let secondCard = null;
	let lockBoard = false;
	let countdown = null;

	// --- DOM ELEMENTS ---
	const grid = document.querySelector(".grid");
	const timerEl = document.getElementById("timer-label");
	const scoreDisplay = document.getElementById("score-display");
	const comboDisplay = document.getElementById("combo-display");
	const hintBtn = document.getElementById("hint-btn");
	const hintCount = document.getElementById("hint-count");
	const nextLevelBtn = document.getElementById("next-level-btn");

		// --- GAME INIT ---
		function startLevel(levelIdx) {
		// Clear grid
		grid.innerHTML = "";
		// Prepare pairs and flat list
		const pairs = levels[levelIdx].pairs;
		const flat = pairs.flat();
		// Shuffle
		const shuffled = flat.sort(() => 0.5 - Math.random());
		// Render cards
		shuffled.forEach(label => {
			const card = document.createElement("div");
			card.className = "card";
			card.innerHTML = `<span class="label">${label}</span>`;
			grid.appendChild(card);
		});
		// Set up state
		matchedPairs = 0;
		firstCard = null;
		secondCard = null;
		lockBoard = false;
		combo = 0;
		hintsLeft = levels[levelIdx].hints;
		seconds = levels[levelIdx].time;
		updateScore();
		updateCombo();
		updateHints();
		// Enable/disable buttons
		hintBtn.disabled = false;
		nextLevelBtn.style.display = "none";
		// Add listeners
		Array.from(document.querySelectorAll(".card")).forEach(card => {
			card.addEventListener("click", () => onCardClick(card, pairs));
		});
		// Start timer
		if (countdown) clearInterval(countdown);
		updateTimer();
		countdown = setInterval(() => {
			seconds--;
			updateTimer();
			if (seconds <= 0) {
				clearInterval(countdown);
				lockBoard = true;
				setTimeout(() => alert("⏰ Time's up! Try again or next level."), 100);
				nextLevelBtn.style.display = "inline-block";
			}
		}, 1000);
	}

	// --- CARD CLICK LOGIC ---
	function onCardClick(card, pairs) {
		if (lockBoard || card.classList.contains("matched") || card === firstCard) return;
		card.classList.add("selected");
		if (!firstCard) {
			firstCard = card;
			return;
		}
		secondCard = card;
		lockBoard = true;
		checkForMatch(pairs);
	}

	// --- MATCH CHECK ---
	function checkForMatch(pairs) {
		const firstLabel = firstCard.querySelector(".label").textContent.trim();
		const secondLabel = secondCard.querySelector(".label").textContent.trim();
		// Build lookup
		const pairMap = {};
		pairs.forEach(([a, b]) => { pairMap[a] = b; pairMap[b] = a; });
		if (pairMap[firstLabel] === secondLabel) {
			firstCard.classList.add("matched");
			secondCard.classList.add("matched");
			firstCard.style.backgroundColor = "#d4edda";
			secondCard.style.backgroundColor = "#d4edda";
			matchedPairs++;
			combo++;
			if (combo > maxCombo) maxCombo = combo;
			let comboBonus = combo > 1 ? 5 * combo : 0;
			score += 10 + comboBonus;
			updateScore();
			updateCombo(comboBonus);
			setTimeout(() => {
				firstCard.style.backgroundColor = "";
				secondCard.style.backgroundColor = "";
				resetBoard();
			}, 500);
			// Win condition
							if (matchedPairs === pairs.length) {
								clearInterval(countdown);
								// Confetti effect for level completion
								if (typeof confetti === 'function') {
									confetti({
										particleCount: 50,
										spread: 70,
										origin: { y: 0.6 },
										colors: ['#3dbff2', '#ffce54', '#b3f0ff']
									});
								}
								setTimeout(() => {
									// Show links after level completion
									const msg = document.createElement('div');
					msg.innerHTML = `🎉 Level ${currentLevel + 1} complete!<br><br>
						<span style="color:#333;">Interested to learn more? Visit here:</span><br>
						<a href="https://www.charitywater.org/donate" target="_blank" style="color:#0077b6;font-weight:bold;">Donate to charity: water</a><br>
						<a href="https://www.charitywater.org/about" target="_blank" style="color:#0077b6;">About Us</a>`;
									const modal = document.createElement('div');
									modal.style.position = 'fixed';
									modal.style.left = 0;
									modal.style.top = 0;
									modal.style.width = '100vw';
									modal.style.height = '100vh';
									modal.style.background = 'rgba(0,0,0,0.4)';
									modal.style.display = 'flex';
									modal.style.alignItems = 'center';
									modal.style.justifyContent = 'center';
									modal.style.zIndex = 1000;
									const box = document.createElement('div');
									box.style.background = '#fff';
									box.style.padding = '32px 24px';
									box.style.borderRadius = '16px';
									box.style.textAlign = 'center';
									box.style.boxShadow = '0 4px 24px rgba(0,0,0,0.12)';
									box.appendChild(msg);
									const closeBtn = document.createElement('button');
									closeBtn.textContent = 'Close';
									closeBtn.style.marginTop = '18px';
									closeBtn.style.padding = '8px 24px';
									closeBtn.style.borderRadius = '8px';
									closeBtn.style.border = 'none';
									closeBtn.style.background = '#00b4d8';
									closeBtn.style.color = '#fff';
									closeBtn.style.fontSize = '1em';
									closeBtn.style.cursor = 'pointer';
									closeBtn.onclick = () => {
										document.body.removeChild(modal);
										nextLevelBtn.style.display = (currentLevel < levels.length - 1) ? "inline-block" : "none";
									};
									box.appendChild(closeBtn);
									modal.appendChild(box);
									document.body.appendChild(modal);
								}, 600);
							}
		} else {
			firstCard.style.backgroundColor = "#ffcccc";
			secondCard.style.backgroundColor = "#ffcccc";
			if (score > 0) score -= 2;
			updateScore();
			combo = 0;
			updateCombo();
			setTimeout(() => {
				firstCard.classList.remove("selected");
				secondCard.classList.remove("selected");
				firstCard.style.backgroundColor = "";
				secondCard.style.backgroundColor = "";
				resetBoard();
			}, 800);
		}
	}

	// --- RESET SELECTION ---
	function resetBoard() {
		[firstCard, secondCard, lockBoard] = [null, null, false];
	}

		// --- SCORE, COMBO, HINTS, TIMER UI ---
		function updateScore(delta = 0) {
			score += delta;
			if (score < 0) score = 0;
			if (scoreDisplay) scoreDisplay.textContent = `Score: ${score}`;
		}
	function updateCombo(bonus = 0) {
		if (!comboDisplay) return;
		if (combo > 1) {
			comboDisplay.textContent = `Combo x${combo}! +${bonus} bonus!`;
			comboDisplay.classList.add("combo-bonus");
			setTimeout(() => comboDisplay.classList.remove("combo-bonus"), 400);
		} else {
			comboDisplay.textContent = "";
		}
	}
	function updateHints() {
		if (hintCount) hintCount.textContent = hintsLeft;
		if (hintBtn) hintBtn.disabled = hintsLeft <= 0;
	}
	function updateTimer() {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		timerEl.textContent = `${m}:${s < 10 ? "0" + s : s}`;
	}

	// --- HINT FEATURE ---
	if (hintBtn) {
		hintBtn.onclick = () => {
			if (hintsLeft <= 0 || lockBoard) return;
			// Find unmatched pairs
			const cards = Array.from(document.querySelectorAll(".card:not(.matched)"));
			const labels = cards.map(card => card.querySelector(".label").textContent.trim());
			const pairs = levels[currentLevel].pairs;
			// Build lookup
			const pairMap = {};
			pairs.forEach(([a, b]) => { pairMap[a] = b; pairMap[b] = a; });
			let found = false;
			for (let i = 0; i < cards.length; i++) {
				const label = labels[i];
				const matchIdx = labels.findIndex((l, idx) => idx !== i && pairMap[label] === l);
				if (matchIdx !== -1) {
					// Highlight both
					cards[i].classList.add("hint-highlight");
					cards[matchIdx].classList.add("hint-highlight");
					setTimeout(() => {
						cards[i].classList.remove("hint-highlight");
						cards[matchIdx].classList.remove("hint-highlight");
					}, 900);
					found = true;
					break;
				}
			}
			if (found) {
				hintsLeft--;
				updateHints();
			}
		};
	}


		// --- NEXT LEVEL BUTTON ---
		if (nextLevelBtn) {
			nextLevelBtn.onclick = () => {
				if (currentLevel < levels.length - 1) {
					currentLevel++;
					startLevel(currentLevel);
				} else {
					alert("🏆 All levels complete! Final Score: " + score + " | Max Combo: x" + maxCombo);
				}
			};
		}

		// --- RESET BUTTON ---
		const resetBtn = document.getElementById("reset-btn");
		if (resetBtn) {
			resetBtn.onclick = () => {
				if (countdown) clearInterval(countdown);
				currentLevel = 0;
				score = 0;
				combo = 0;
				maxCombo = 0;
				startLevel(currentLevel);
			};
		}

		// --- SCORE PENALTY EVERY 10 SECONDS ---
		setInterval(() => updateScore(-5), 10000);

		// --- START GAME ---
		startLevel(currentLevel);
});
