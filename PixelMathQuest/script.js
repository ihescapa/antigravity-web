const scienceFacts = [
    "Los pulpos tienen TRES corazones y su sangre es AZUL. 🐙",
    "Un día en el planeta Venus dura más que un año entero en Venus. 🪐",
    "¡Los plátanos son bayas, pero las fresas no lo son! 🍌",
    "Las vacas tienen mejores amigas y se estresan si las separan. 🐄",
    "El corazón de un colibrí late hasta 1.200 veces por minuto. 🐦",
    "Hay más estrellas en el universo que granos de arena en todas las playas de la Tierra. ⭐",
    "Los pingüinos tienen una glándula arriba de los ojos que convierte el agua salada en agua dulce. 🐧",
    "Las abejas pueden reconocer rostros humanos. 🐝",
    "El agujero más profundo cavado por el hombre tiene 12 kilómetros hacia el centro de la Tierra. 🕳️",
    "Los delfines se ponen 'nombres' entre ellos mediante silbidos únicos. 🐬",
    "Júpiter atrapa muchos asteroides, ¡es como el escudo guardián de la Tierra! 🛡️",
    "Las manzanas flotan en el agua porque el 25% de su volumen es aire. 🍎",
    "Una nube cúmulo promedio pesa lo mismo que ¡100 elefantes! ☁️",
    "Los caracoles pueden dormir hasta 3 años enteros. 🐌",
    "Las nutrias se dan la mano al dormir para no separarse con la corriente del agua. 🦦",
    "Los flamencos son rosas por los camarones que comen. Nacen de color gris. 🦩",
    "El sudor de los hipopótamos es color rosa y actúa como protector solar. 🦛",
    "La Tierra es el único planeta de nuestro sistema solar que no tiene el nombre de un dios romano. 🌍",
    "Los tigres tienen la piel rayada, no solo su pelaje. 🐅",
    "Un lápiz común tiene suficiente grafito para dibujar una línea de 56 kilómetros de largo. ✏️",
    "Los murciélagos son los únicos mamíferos que pueden volar. 🦇",
    "Los huesos humanos son más fuertes que el concreto. 🦴",
    "Los cocodrilos no pueden sacar la lengua. 🐊",
    "Los koalas tienen huellas dactilares casi idénticas a las humanas. 🐨",
    "La luz del Sol tarda unos 8 minutos en llegar a la Tierra. ☀️",
    "En Urano llueven diamantes sólidos por la extrema presión. 💎",
    "Las estrellas de mar no tienen cerebro ni sangre. ⭐",
    "Los caballos y las ratas no pueden vomitar. 🐎",
    "El ojo de un avestruz es más grande que su cerebro. 🦅",
    "Una medusa está compuesta en un 95% de pura agua. 🪼",
    "Los castores tienen los dientes naranjas gracias al hierro, que los hace súper fuertes. 🦫",
    "Los osos polares tienen la piel negra, su pelo es transparente. 🐻‍❄️",
    "Venus es el planeta más caliente de todos, incluso más que Mercurio que está más cerca del sol. 🔥",
    "La huella de la nariz de un perro es única, como nuestra huella dactilar. 🐕",
    "Un rayo tiene la energía suficiente para tostar 100.000 tajadas de pan. ⚡",
    "Las jirafas tienen la lengua de color azul purpúreo para que no se queme con el sol. 🦒",
    "El polvo de tu casa es en gran parte piel muerta humana. ¡Ay! 🧹",
    "Los gatos no pueden saborear las cosas dulces. 😻",
    "Las tortugas gigantes de las islas Galápagos pueden vivir más de 100 años. 🐢",
    "El oro es un material alienígena que llegó a la Tierra en meteoritos. 🪙",
    "Hay medusas inmortales que pueden vivir para siempre si nadie se las come. 🌊",
    "Un camaleón tiene la lengua tan larga como todo su cuerpo. 🦎",
    "Los canguros no pueden caminar hacia atrás. 🦘",
    "Una cucaracha puede vivir semanas sin cabeza. 🪳",
    "Júpiter tiene al menos 95 lunas orbitándolo. 🌙",
    "Las hormigas no tienen pulmones reales, respiran por agujeritos en su cuerpo. 🐜"
];

// database.js is loaded before this script, bringing GAME_DATABASE into scope.
const builtInFacts = [...scienceFacts]; // keep facts


document.addEventListener('DOMContentLoaded', () => {
    // --- Audio System ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playTone(freq, type, duration) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    }
    const playClick = () => playTone(500, 'square', 0.05);
    const playSuccess = () => {
        playTone(392, 'square', 0.1); 
        setTimeout(() => playTone(523, 'square', 0.1), 100); 
        setTimeout(() => playTone(659, 'square', 0.1), 200); 
        setTimeout(() => playTone(783, 'square', 0.15), 300); 
        setTimeout(() => playTone(1046, 'square', 0.4), 450); 
    };
    const playError = () => {
        playTone(200, 'sawtooth', 0.15);
        setTimeout(() => playTone(170, 'sawtooth', 0.15), 150);
        setTimeout(() => playTone(140, 'sawtooth', 0.3), 300);
        setTimeout(() => playTone(100, 'sawtooth', 0.5), 450);
    };
    const playSelect = () => playTone(600, 'sine', 0.05);

    // --- UI Elements ---
    const screens = {
        start: document.getElementById('start-screen'),
        game: document.getElementById('game-screen')
    };
    const ui = {
        btnsMission: document.querySelectorAll('[data-mission]'),
        btnBack: document.getElementById('btn-back'),
        btnSolve: document.getElementById('btn-solve'),
        btnNextCase: document.getElementById('btn-next-case'),
        btnRetryCase: document.getElementById('btn-retry-case'),
        missionTitle: document.getElementById('mission-title'),
        missionIcon: document.getElementById('mission-icon'),
        caseId: document.getElementById('case-id'),
        problemText: document.getElementById('problem-text'),
        scoreWinsDisplay: document.getElementById('score-wins'),
        scoreLossesDisplay: document.getElementById('score-losses'),
        feedback: document.getElementById('feedback-message'),
        modalSuccess: document.getElementById('success-modal'),
        modalError: document.getElementById('error-modal'),
        scienceFactText: document.getElementById('science-fact'),
        errorExplanation: document.getElementById('error-explanation'),
        factIdDisplay: document.getElementById('fact-id'),
        mechanics: {
            builder: document.getElementById('mechanic-builder'),
            approx: document.getElementById('mechanic-approx'),
            collector: document.getElementById('mechanic-collector'),
            sequence: document.getElementById('mechanic-sequence')
        },
        builderPool: document.getElementById('builder-pool'),
        builderSolution: document.getElementById('builder-solution'),
        approxGrid: document.getElementById('approx-options'),
        collectorText: document.getElementById('collector-text'),
        sequenceDisplay: document.getElementById('sequence-display'),
        sequenceInput: document.getElementById('sequence-input'),
        folderBox: document.querySelector('.folder')
    };

    // --- Game State ---
    let currentMode = '';
    let winsScore = 0;
    let lossesScore = 0;
    let expectedLogic = {}; 
    let availableFacts = [...scienceFacts];

    // --- Events ---
    ui.btnsMission.forEach(btn => {
        btn.addEventListener('click', () => {
            playClick();
            startMission(btn.getAttribute('data-mission'));
        });
    });

    ui.btnBack.addEventListener('click', () => {
        playClick();
        showScreen(screens.start);
    });

    ui.btnSolve.addEventListener('click', () => {
        playClick();
        validateAnswer();
    });

    ui.btnNextCase.addEventListener('click', () => {
        playClick();
        ui.modalSuccess.classList.add('hidden');
        startMission(currentMode); // Generates entirely new case for same mechanic
    });

    ui.btnRetryCase.addEventListener('click', () => {
        playClick();
        ui.modalError.classList.add('hidden');
    });

    // --- Core Functions ---
    function showScreen(screen) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
        clearFeedback();
    }

    function clearFeedback() {
        ui.feedback.textContent = '';
        ui.feedback.className = 'feedback';
    }

    function startMission(mode) {
        currentMode = mode;
        ui.caseId.textContent = Math.floor(Math.random() * 9000 + 1000);
        updateScoreDisplay();
        
        Object.values(ui.mechanics).forEach(m => m.classList.add('hidden'));
        clearFeedback();
        
        if (mode === 'builder') {
            ui.missionTitle.textContent = "CONSTRUYENDO PISTAS";
            ui.missionIcon.textContent = "🧩";
            ui.mechanics.builder.classList.remove('hidden');
            generateBuilderCase();
        } else if (mode === 'approx') {
            ui.missionTitle.textContent = "ESTIMACIÓN RÁPIDA";
            ui.missionIcon.textContent = "⏱️";
            ui.mechanics.approx.classList.remove('hidden');
            generateApproxCase();
        } else if (mode === 'collector') {
            ui.missionTitle.textContent = "FILTRO DE MENTIRAS";
            ui.missionIcon.textContent = "🔦";
            ui.mechanics.collector.classList.remove('hidden');
            generateCollectorCase();
        } else if (mode === 'sequence') {
            ui.missionTitle.textContent = "CÓDIGO SECRETO";
            ui.missionIcon.textContent = "🔓";
            ui.mechanics.sequence.classList.remove('hidden');
            generateSequenceCase();
        }
        
        showScreen(screens.game);
    }

    // --- Case Generators ---

    // 1. BUILDER (Hardcoded)
    function generateBuilderCase() {
        const db = window.GAME_DATABASE.builder;
        const caseData = getRandomFrom(db);
        
        ui.problemText.innerHTML = caseData.text;
        expectedLogic = { 
            type: 'builder', 
            parts: caseData.components,
            explanation: caseData.explanation
        };
        
        // Combine components and distractors into one pool to shuffle
        let allBoxes = caseData.components.concat(caseData.distractors);
        renderBuilderBoxes(allBoxes);
    }

    function renderBuilderBoxes(components) {
        ui.builderPool.innerHTML = '';
        ui.builderSolution.innerHTML = '';
        
        const shuffled = [...components].sort(() => Math.random() - 0.5);
        shuffled.forEach(comp => {
            const box = document.createElement('div');
            box.className = 'math-box';
            box.textContent = comp;
            box.addEventListener('click', () => {
                playSelect();
                if (box.parentElement === ui.builderPool) ui.builderSolution.appendChild(box);
                else ui.builderPool.appendChild(box);
            });
            ui.builderPool.appendChild(box);
        });
    }

    // 2. APPROX (Hardcoded)
    function generateApproxCase() {
        const db = window.GAME_DATABASE.approx;
        const caseData = getRandomFrom(db);
        
        ui.problemText.innerHTML = caseData.text;
        expectedLogic = { 
            type: 'approx', 
            answer: caseData.options[caseData.answerIndex],
            explanation: caseData.explanation,
            userSelection: null
        };
        
        // Shuffle options for display
        let optionsDisplay = [...caseData.options].sort(() => Math.random() - 0.5);
        
        ui.approxGrid.innerHTML = '';
        optionsDisplay.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'approx-btn';
            btn.textContent = '> ' + opt;
            btn.addEventListener('click', () => {
                playSelect();
                document.querySelectorAll('.approx-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                expectedLogic.userSelection = opt;
            });
            ui.approxGrid.appendChild(btn);
        });
    }

    // 3. COLLECTOR (Hardcoded)
    function generateCollectorCase() {
        const db = window.GAME_DATABASE.collector;
        const caseData = getRandomFrom(db);
        
        ui.problemText.innerHTML = "Nuestra misión es extraer la información correcta. Lee el texto y haz click/destaca ÚNICAMENTE los números de la respuesta.";
        ui.collectorText.innerHTML = caseData.text;
        
        expectedLogic = { 
            type: 'collector',
            targetCount: caseData.targetCount,
            explanation: caseData.explanation
        };
        
        document.querySelectorAll('.selectable-wrap').forEach(el => {
            el.addEventListener('click', () => {
                playSelect();
                el.classList.toggle('active');
            });
        });
    }

    // 4. SEQUENCE (Hardcoded)
    function generateSequenceCase() {
        const db = window.GAME_DATABASE.sequence;
        const caseData = getRandomFrom(db);
        
        ui.problemText.innerHTML = caseData.text;
        ui.sequenceInput.value = '';
        
        expectedLogic = { 
            type: 'sequence', 
            answer: caseData.answer, 
            explanation: caseData.explanation 
        };

        ui.sequenceDisplay.innerHTML = '';
        caseData.sequence.forEach(num => {
            let b = document.createElement('div');
            b.className = 'seq-box';
            b.textContent = num;
            ui.sequenceDisplay.appendChild(b);
        });
    }

    // --- Validation System ---
    function validateAnswer() {
        let isCorrect = false;

        if (expectedLogic.type === 'builder') {
            const currentSolution = Array.from(ui.builderSolution.children).map(c => c.textContent);
            if (currentSolution.length === 0) return; // Ignore bare click
            
            if (currentSolution.length !== expectedLogic.parts.length) {
                isCorrect = false;
            } else if (expectedLogic.parts[1] === '+') {
                isCorrect = currentSolution[1] === '+' && 
                           ((currentSolution[0] === expectedLogic.parts[0] && currentSolution[2] === expectedLogic.parts[2]) ||
                            (currentSolution[0] === expectedLogic.parts[2] && currentSolution[2] === expectedLogic.parts[0]));
            } else {
                isCorrect = JSON.stringify(currentSolution) === JSON.stringify(expectedLogic.parts);
            }
        } 
        else if (expectedLogic.type === 'approx') {
            if (!expectedLogic.userSelection) return;
            isCorrect = expectedLogic.userSelection === expectedLogic.answer;
        }
        else if (expectedLogic.type === 'collector') {
            let correctCount = 0;
            let errorCount = 0;
            document.querySelectorAll('.selectable-wrap').forEach(el => {
                if (el.classList.contains('active')) {
                    if (el.getAttribute('data-val') === 'useful') correctCount++;
                    else errorCount++;
                }
            });
            isCorrect = (correctCount === expectedLogic.targetCount && errorCount === 0);
        }
        else if (expectedLogic.type === 'sequence') {
            const val = parseInt(ui.sequenceInput.value);
            if(isNaN(val)) return;
            isCorrect = (val === expectedLogic.answer);
        }

        if (isCorrect) handleSuccess();
        else handleError();
    }

    function handleSuccess() {
        playSuccess();
        
        const flash = document.getElementById('flash-overlay');
        if(flash) {
            flash.classList.remove('flash-success-anim', 'flash-error-anim');
            void flash.offsetWidth; 
            flash.classList.add('flash-success-anim');
        }
        
        ui.feedback.innerHTML = "¡CASO CERRADO!<br><small>Procesando recompensa...</small>";
        ui.feedback.className = 'feedback success';
        createParticles(true);
        winsScore++;
        updateScoreDisplay();
        
        setTimeout(() => {
            showRewardModal();
        }, 1500);
    }

    function handleError() {
        playError();
        
        const flash = document.getElementById('flash-overlay');
        if(flash) {
            flash.classList.remove('flash-success-anim', 'flash-error-anim');
            void flash.offsetWidth; 
            flash.classList.add('flash-error-anim');
        }
        
        lossesScore++;
        updateScoreDisplay();
        
        ui.folderBox.classList.remove('shake-element');
        void ui.folderBox.offsetWidth; 
        ui.folderBox.classList.add('shake-element');
        
        setTimeout(() => {
            showErrorModal();
        }, 600); // Muestra la modal luego de sacudirse
    }

    // --- Modals System ---
    function showRewardModal() {
        if(availableFacts.length === 0) availableFacts = [...scienceFacts]; 
        
        const randomIndex = Math.floor(Math.random() * availableFacts.length);
        const fact = availableFacts.splice(randomIndex, 1)[0]; 
        
        ui.factIdDisplay.textContent = Math.floor(Math.random() * 900) + 100;
        ui.scienceFactText.textContent = fact;
        
        ui.modalSuccess.classList.remove('hidden');
        createParticles(true, 50); 
    }
    
    function showErrorModal() {
        ui.errorExplanation.textContent = expectedLogic.explanation || "Analiza bien los números y la lógica, había un error en este intento.";
        ui.modalError.classList.remove('hidden');
    }

    function updateScoreDisplay() {
        if(ui.scoreWinsDisplay && ui.scoreLossesDisplay) {
            ui.scoreWinsDisplay.textContent = winsScore;
            ui.scoreLossesDisplay.textContent = lossesScore;
        }
    }

    // --- Helpers ---
    function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function getRandomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function createParticles(isConfetti = false, limit = 30) {
        const container = document.getElementById('particles');
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for(let i=0; i<limit; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = getRandomInt(5, 20);
            
            particle.style.width = isConfetti ? `${size}px` : `${getRandomInt(2,6)}px`;
            particle.style.height = isConfetti ? `${size}px` : `${getRandomInt(2,6)}px`;
            
            const colors = ['#1cc738', '#00e5ff', '#ff3c38', '#fff', '#ffd700', '#ff00ff'];
            particle.style.backgroundColor = colors[getRandomInt(0, colors.length-1)];
            
            particle.style.position = 'absolute';
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY + 100}px`;
            
            if(isConfetti) {
                particle.style.borderRadius = "0px";
                const dx = (Math.random() - 0.5) * 800;
                const dy = (Math.random() - 1) * 800; 
                const rot = getRandomInt(180, 1080);
                
                particle.animate([
                    { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
                    { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(0.5)`, opacity: 0 }
                ], {
                    duration: getRandomInt(1500, 3000),
                    easing: 'cubic-bezier(0, .9, .57, 1)'
                });
            } else {
                const dx = (Math.random() - 0.5) * 400;
                const dy = (Math.random() - 0.5) * 400; 
                particle.animate([
                    { transform: 'translate(0, 0)', opacity: 1 },
                    { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'ease-out'
                });
            }
            container.appendChild(particle);
            setTimeout(() => particle.remove(), 2900);
        }
    }
});
