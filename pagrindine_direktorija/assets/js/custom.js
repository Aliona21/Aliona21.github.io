document.addEventListener("DOMContentLoaded", function () {
    function updateRangeValue(id) {
        const rangeInput = document.getElementById(id);
        const outputElement = document.getElementById(id + "_value");
        if (rangeInput && outputElement) {
            outputElement.textContent = rangeInput.value;
        }
    }

    ['q1', 'q2', 'q3'].forEach(id => {
        const rangeInput = document.getElementById(id);
        if (rangeInput) {
            updateRangeValue(id); 
            rangeInput.addEventListener('input', () => updateRangeValue(id));
        }
    });

    function showPopup() {
        const popup = document.getElementById("popup");
        popup.style.display = "block";
        popup.classList.add("show");

        setTimeout(() => {
            popup.classList.remove("show");
            setTimeout(() => popup.style.display = "none", 400);
        }, 3000);
    }
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isOnlyLetters(text) {
        const lettersRegex = /^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]+$/;
        return lettersRegex.test(text.trim());
    }

    const validationStatus = {
        fname: false,
        lname: false,
        email: false,
        address: false,
        phone: false
    };

    function validateField(inputElement, validationType) {
        const value = inputElement.value.trim();
        const errorElement = document.getElementById(inputElement.id + "-error");
        let errorMessage = '';
        let isValid = true;

        if (value === '') {
            errorMessage = 'Šis laukas yra privalomas.';
            isValid = false;
        } else {
            switch (validationType) {
                case 'name':
                    if (!isOnlyLetters(value)) {
                        errorMessage = 'Galima naudoti tik raides.';
                        isValid = false;
                    }
                    break;
                case 'email':
                    if (!isValidEmail(value)) {
                        errorMessage = 'Įveskite teisingą el. pašto adresą.';
                        isValid = false;
                    }
                    break;
                case 'phone':
                    if (value.replace(/\D/g, '').length !== 11) {
                         errorMessage = 'Telefono numeris turi būti 11 skaitmenų (+370 6xx xxxxx).';
                         isValid = false;
                    }
                    break;
                case 'address':
                    break;
            }
        }

        if (!isValid) {
            inputElement.classList.add('is-invalid');
            errorElement.textContent = errorMessage;
        } else {
            inputElement.classList.remove('is-invalid');
            if (errorElement) errorElement.textContent = '';
        }
        
        validationStatus[inputElement.id] = isValid; 

        checkFormValidity();

        return isValid;
    }

    function formatPhoneNumber(inputElement) {
        let value = inputElement.value.replace(/\D/g, '');

        const MAX_DIGITS = 11;
        value = value.substring(0, MAX_DIGITS);
        
        let formattedValue = '';

        if (value.length > 0) {
            formattedValue += '+';
        }
        
        if (value.length > 3) {
            formattedValue += value.substring(0, 3) + ' ';
            
            if (value.length > 6) {
                formattedValue += value.substring(3, 6) + ' ';
                formattedValue += value.substring(6, MAX_DIGITS);
            } else {
                formattedValue += value.substring(3);
            }
        } else {
            formattedValue += value;
        }

        inputElement.value = formattedValue;
        validateField(inputElement, 'phone');
    }

    const submitBtn = document.getElementById('submitBtn');

    function checkFormValidity() {
        const allValid = Object.values(validationStatus).every(status => status === true);
        
        if (allValid) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    const fnameInput = document.getElementById('fname');
    const lnameInput = document.getElementById('lname');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');

    checkFormValidity();
    fnameInput.addEventListener('input', () => validateField(fnameInput, 'name'));
    lnameInput.addEventListener('input', () => validateField(lnameInput, 'name'));
    emailInput.addEventListener('input', () => validateField(emailInput, 'email'));
    addressInput.addEventListener('input', () => validateField(addressInput, 'address'));
    phoneInput.addEventListener('input', () => formatPhoneNumber(phoneInput));
    
    document.getElementById("feedbackForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const form = this;
        
        const finalCheck = Object.values(validationStatus).every(status => status === true);
        
        if (!finalCheck) {
            return;
        }

        const isFnameValid = validateField(fnameInput, 'name');
        const isLnameValid = validateField(lnameInput, 'name');
        const isEmailValid = validateField(emailInput, 'email');
        const isAddressValid = validateField(addressInput, 'address');

        const isPhoneFilled = phoneInput.value.trim() !== ''; 
        if (!isPhoneFilled) {
            validateField(phoneInput, 'phone');
        }
        
        if (!isFnameValid || !isLnameValid || !isEmailValid || !isAddressValid || !isPhoneFilled) {
            return;
        }

        const vardas = fnameInput.value.trim();
        const pavarde = lnameInput.value.trim();
        const email = emailInput.value.trim();
        const telefonas = phoneInput.value.trim();
        const adresas = addressInput.value.trim();

        const q1 = Number(document.getElementById("q1").value);
        const q2 = Number(document.getElementById("q2").value);
        const q3 = Number(document.getElementById("q3").value);

        const vidurkis = ((q1 + q2 + q3) / 3).toFixed(1);

        const formData = {
            Vardas: vardas,
            Pavardė: pavarde,
            El_paštas: email,
            Tel_numeris: telefonas,
            Adresas: adresas,
            Q1_Vertinimas: q1,
            Q2_Vertinimas: q2,
            Q3_Vertinimas: q3,
            Vertinimu_Vidurkis: vidurkis
        };

        console.log("Pateikti formos duomenys:", formData);

        document.getElementById("result").innerHTML = `
            <p>Vardas: <strong>${vardas}</strong></p>
            <p>Pavardė: <strong>${pavarde}</strong></p>
            <p>El. paštas: <strong>${email}</strong></p>
            <p>Tel. numeris: <strong>${telefonas}</strong></p>
            <p>Adresas: <strong>${adresas}</strong></p>
            <hr>
            <p>1. Pirmas klausimas: <strong>${q1}</strong></p>
            <p>2. Antras klausimas: <strong>${q2}</strong></p>
            <p>3. Trečias klausimas: <strong>${q3}</strong></p>
            <hr>
            <p>Bendrai įvertinta: <strong>${vidurkis}</strong></p>
        `;

        document.getElementById("resultsSection").style.display = "block";

        showPopup();
        form.reset();
        
        ['q1', 'q2', 'q3'].forEach(id => {
            document.getElementById(id).value = 5;
            updateRangeValue(id); 
        });

        Object.keys(validationStatus).forEach(key => validationStatus[key] = false);
        checkFormValidity();
        
        [fnameInput, lnameInput, emailInput, phoneInput, addressInput].forEach(input => {
            input.classList.remove('is-invalid');
            const errorElement = document.getElementById(input.id + "-error");
            if (errorElement) errorElement.textContent = '';
        });

        form.style.display = 'none';
    });

    // ŽAIDIMAS
    const uniqueCardIcons = [
        'bi-star-fill',
        'bi-heart-fill',
        'bi-lightning-fill',
        'bi-bell-fill',
        'bi-cloud-fill',
        'bi-cpu-fill',
        'bi-gem',
        'bi-trophy-fill',
        'bi-house-fill',
        'bi-car-front-fill',
        'bi-bug-fill',
        'bi-puzzle-fill'
    ];

    let gameData = [];
    let difficulty = 'easy'; 
    let gameActive = false;
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard = null;
    let secondCard = null;
    let moves = 0;
    let matchedPairsCount = 0;
    let bestScores = {
        easy: null,
        hard: null
    };
    let seconds = 0;
    let timerInterval = null;

    const gameBoard = document.getElementById('gameBoard');
    const difficultySelect = document.getElementById('difficulty');
    const startGameBtn = document.getElementById('startGameBtn');
    const resetGameBtn = document.getElementById('resetGameBtn');
    const movesCountElement = document.getElementById('movesCount');
    const matchedPairsElement = document.getElementById('matchedPairs');
    const totalPairsElement = document.getElementById('totalPairs');
    const winMessageElement = document.getElementById('winMessage');
    const bestScoreDisplayElement = document.getElementById('bestScoreDisplay');
    const gameTimerElement = document.getElementById('gameTimer');


    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function handleCardClick(e) {
        if (!gameActive) return;
        const clickedCardElement = e.currentTarget;
        
        if (lockBoard) return;
        if (clickedCardElement === firstCard) return;
        if (clickedCardElement.classList.contains('matched')) return;

        clickedCardElement.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = clickedCardElement;
            return;
        }

        secondCard = clickedCardElement;
        
        moves++;
        movesCountElement.textContent = moves;

        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        firstCard.removeEventListener('click', handleCardClick);
        secondCard.removeEventListener('click', handleCardClick);
        
        matchedPairsCount++;
        matchedPairsElement.textContent = matchedPairsCount;
        
        resetBoard();
        
        checkWinCondition();
    }

    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            resetBoard();
        }, 1000);
    }
    
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    function checkWinCondition() {
        const totalCards = gameData.length;
        const totalMatchesNeeded = totalCards / 2;
        
        if (matchedPairsCount === totalMatchesNeeded) {
            stopTimer();
            updateBestScore();
            winMessageElement.textContent = `Laimėjote! Žaidimas baigtas per ${moves} ėjimus!`;
            winMessageElement.style.display = 'block';
            resetGameBtn.disabled = false;
            startGameBtn.disabled = false;
            
            gameActive = false;
        }
    }

    function generateGameBoard(difficultyLevel) {
        let numUniqueCards;
        let numColumns;
        
        if (difficultyLevel === 'hard') {
            numUniqueCards = 12; 
            numColumns = 6;
        } else {
            numUniqueCards = 6;
            numColumns = 4;
        }
        
        gameBoard.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
        
        const selectedIcons = uniqueCardIcons.slice(0, numUniqueCards);
        const cardsToUse = [...selectedIcons, ...selectedIcons];

        gameData = shuffleArray(cardsToUse.map((icon, index) => ({
            id: index,
            icon: icon,
            isFlipped: false,
            isMatched: false
        })));
        
        totalPairsElement.textContent = numUniqueCards;
        
        if (timerInterval) stopTimer();
        gameTimerElement.textContent = '0:00';
        moves = 0;
        matchedPairsCount = 0;
        movesCountElement.textContent = moves;
        matchedPairsElement.textContent = matchedPairsCount;
        winMessageElement.style.display = 'none';
        gameActive = false;
        
        displayBestScore();

        renderCards();
    }


    function renderCards() {
        gameBoard.innerHTML = '';
        gameData.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.icon = card.icon;
            cardElement.dataset.id = card.id;
            
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.innerHTML = `<i class="bi ${card.icon}"></i>`;
            
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');
            cardBack.innerHTML = '<i class="bi bi-question-lg"></i>';
            
            cardElement.appendChild(cardFront);
            cardElement.appendChild(cardBack);
            
            cardElement.addEventListener('click', handleCardClick);

            gameBoard.appendChild(cardElement);
        });
    }

    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        
        seconds = 0;
        gameTimerElement.textContent = '0:00';
        
        timerInterval = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            const timeString = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
            gameTimerElement.textContent = timeString;
        }, 1000);
    }
    
    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function getBestScores() {
        const scores = localStorage.getItem('memoryGameBestScores');
        if (scores) {
            bestScores = JSON.parse(scores);
        }
        displayBestScore();
    }

    function displayBestScore() {
        const currentBest = bestScores[difficulty];
        if (currentBest !== null) {
            bestScoreDisplayElement.textContent = `Geriausias rezultatas: ${currentBest} ėjimai`;
        } else {
            bestScoreDisplayElement.textContent = `Geriausias rezultatas: N/A`;
        }
    }
    
    function updateBestScore() {
        const currentBest = bestScores[difficulty];
        
        if (currentBest === null || moves < currentBest) {
            bestScores[difficulty] = moves;
            localStorage.setItem('memoryGameBestScores', JSON.stringify(bestScores));
            displayBestScore();
        }
    }

    difficultySelect.addEventListener('change', (e) => {
        difficulty = e.target.value;
        generateGameBoard(difficulty); 
    });

    startGameBtn.addEventListener('click', () => {
        generateGameBoard(difficulty);
        startTimer();
        gameActive = true;
        resetGameBtn.disabled = false;
        startGameBtn.disabled = true; 
    });

    resetGameBtn.addEventListener('click', () => {
        generateGameBoard(difficulty);
        resetGameBtn.disabled = true;
        startGameBtn.disabled = false; 
    });

    getBestScores();
    
    generateGameBoard(difficulty);
});

