let app = new Vue({
    el: '.main',
    data: {
        showMain: true,
        showAuthor: false,
        showQuestion: false,
        showResult: false,
        number: 0,
        score: {
            'EE': 0,
            'DP': 0,
            'RPA': 0,
        },
        totalGame: localStorage.getItem('MBItotalGame') ? JSON.parse(localStorage.getItem('MBItotalGame')) : {
            'EE': 0,
            'DP': 0,
            'RPA': 0,
        },
        isOpen: {
            'EE': false,
            'DP': false,
            'RPA': false,
         },
        totalGames: localStorage.getItem('MBItotalGames') ? localStorage.getItem('MBItotalGames') : 0,
        IntIndex: localStorage.getItem('MBIIntIndex') ? localStorage.getItem('MBIIntIndex') : 0,
        questions: questions,
        result: resultMessages,
        resultMBI: 'first'                
    },
    methods: {
        goToMain() {
            this.showMain = true
            this.showAuthor = false
            this.showQuestion = false
            this.showResult = false
        },
        goToAuthor() {
            this.showMain = false
            this.showAuthor = true
            this.showQuestion = false
            this.showResult = false
        },
        goToResult(MBI) {
            if (this.totalGames > 0) {
                this.showMain = false
                this.showAuthor = false
                this.showQuestion = false
                this.showResult = true
                this.resultMBI = MBI
                this.setResultMBI()
                } else {
                    this.goToQuestion()
                }
        },
        goToQuestion() {
            this.score = {
                'EE': 0,
                'DP': 0,
                'RPA': 0,
            }
            this.showMain = false
            this.showAuthor = false
            this.showQuestion = true
            this.showResult = false
        },
        nextQuestion(answer) {
            this.addValue(answer[0], answer[1])
            if (this.number === 21) {
                this.endGame()
            } else {
                this.number++
            }
        },
        addValue(scale, value) {
            this.score[scale]+=value;
        },
        endGame() {
            this.totalGames++;
            localStorage.setItem('MBItotalGames', this.totalGames)
            
            this.totalGame.EE = this.score.EE
            this.totalGame.DP = this.score.DP
            this.totalGame.RPA = this.score.RPA

            localStorage.setItem('MBItotalGame', JSON.stringify(this.totalGame))

            this.IntIndex = Math.sqrt(((this.score.EE / 54) ** 2 + (this.score.DP / 30) ** 2 + (1 - this.score.RPA / 48) ** 2) / 3);

            localStorage.setItem('MBIIntIndex', this.IntIndex)

            this.number = 0
            this.goToResult()
            this.setResultMBI()
                                
        },
        getResultTitle(intIndex) {
            for (let i = thresholds.length - 1; i >= 0; i--) {
                if (intIndex >= thresholds[i]) {
                    return titles[i];
                }
            }

            return titles[0]; // Вернем первый заголовок, если ни одно условие не сработало
        },
        getResultScale(scale) {
            const scaleValue = this.totalGame[scale];

            const result = resultRanges[scale].find(([min, max]) => scaleValue >= min && scaleValue <= max);

            return result ? result[2] : "Некорректное значение";
        },
        getResultText(scale) {
            const scaleValue = this.totalGame[scale];

            const messages = resultMessages[scale];

            for (const { range, message } of messages) {
                const [low, high] = range;
                if (scaleValue >= low && scaleValue <= high) {
                    return message;
                }
            }

            return "Некорректные данные"; // В случае, если данные не входят в заданные диапазоны
        },
        setResultMBI() {
            const MBIIntIndex = localStorage.getItem('MBIIntIndex') ? parseFloat(localStorage.getItem('MBIIntIndex')) : 0;

            const resultMBIValues = ['first', 'second', 'third', 'fourth'];

            for (let i = 0; i < thresholds.length; i++) {
                if (MBIIntIndex < thresholds[i]) {
                    this.resultMBI = resultMBIValues[i];
                    return;
                }
            }

            this.resultMBI = 'fourth'; // Значение по умолчанию, если MBIIntIndex выше последнего порога
        },
        toggleAccordion(scale) {
            this.isOpen[scale] = !this.isOpen[scale];
        },
        
    }
})