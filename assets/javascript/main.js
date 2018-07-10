function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function noQuestions() {
    alert("Sorry! The API does not have enough questions for these parameters.");
}


$(document).ready(function () {

    let apiQuery = {
        queryAmount: 10,
        queryCategory: 11,
        queryDifficulty: "medium",
        queryType: "multiple",
        queryURL: function () {
            let url = "https://opentdb.com/api.php?amount=" + this.queryAmount + "&category=" + this.queryCategory + "&difficulty=" + this.queryDifficulty + "&type=" + this.queryType;
            return url;
        },
    }
    console.log(apiQuery.queryURL());
    $.ajax({
        url: apiQuery.queryURL(),
        method: "GET",
    }).then(function (response) {
        console.log(response);
        if (response.response_code) {
            noQuestions();
        } else {
            tQuiz.startGame(response);
        }





    });

    let tQuiz = {
        timer: 30,
        timerInt: 0,
        currQ: 0,
        userAnswers: [],
        correctAnswers: [],
        incorrectAnswers: [],
        quizQuestions: [],
        aCorrect: 0,
        aIncorrect: 0,
        aUnanswered: 0,
        isSubmit: false,
        correctMsg: $("<div>Correct!</div>").addClass("p-2 alert-success"),
        incorrectMsg: $("<div>Incorrect!</div>").addClass("p-2 alert-danger"),
        timesUp: $("<div>Time's up!</div>").addClass("p-2 alert-warning"),
        startGame: function (apiQuestions) {
            console.log(apiQuestions);
            apiQuestions.results.forEach(function (e, i) {
                tQuiz.correctAnswers[i] = e.correct_answer;
                tQuiz.incorrectAnswers[i] = e.incorrect_answers;
                tQuiz.quizQuestions[i] = e.question;
            });
            this.timerInt = setInterval(this.countdown, 1000);
            this.makeQuestion();
        },
        countdown: function () {
            if (tQuiz.timer >= 10) {
                $("#timer-display").text("00:"+tQuiz.timer);
                tQuiz.timer--;
            } else if (tQuiz.timer >= 0) {
                $("#timer-display").text("00:0"+tQuiz.timer);
                tQuiz.timer--;
            } else {
                clearInterval(tQuiz.timerInt);
                tQuiz.takeAnswer();
                setTimeout(tQuiz.nextQuestion(), 3000);
            }
        },
        submitAnswer: $("#submit-button").click(function () {
            if ($("input:checked").val()) {
                tQuiz.isSubmit = true;
                $(this).off("click");
                tQuiz.takeAnswer();
                setTimeout(tQuiz.nextQuestion(), 3000);
            }
        }),
        takeAnswer: function () {
            let userAnswer = $("input:checked").val();
            this.userAnswers.push(userAnswer);
            if (userAnswer) {
                this.compareAnswer(userAnswer, this.currQ);
            } else {
                $("*[data-correct-answer").css("color", "green");
                $("#result-msg").append(tQuiz.timesUp);
                this.aUnanswered++;
            }
        },
        compareAnswer: function (ans, currQ) {
            if (ans === this.correctAnswers[currQ]) {
                this.aCorrect++;
                $("*[data-correct-answer").css("color", "green");
                $("#result-msg").append(tQuiz.correctMsg);
            } else {
                this.aIncorrect++;
                $("*[data-correct-answer]").css("color", "green");
                $("input:checked").parent().css("color", "red");
                $("#result-msg").append(tQuiz.incorrectMsg);
            }
        },
        nextQuestion: function () {
            tQuiz.timer = 3;
            clearInterval(tQuiz.timerInt);
            nextQInt = setInterval(this.countdown, 1000);
            if (this.currQ < 9) {
                setTimeout(function () {
                    tQuiz.currQ++;
                    clearInterval(nextQInt);
                    tQuiz.timer = 30;
                    tQuiz.timerInt = setInterval(tQuiz.countdown, 1000);
                    if (tQuiz.isSubmit) {
                        tQuiz.isSubmit = false;
                        $("#submit-button").click(function () {
                            if ($("input:checked").val()) {
                                tQuiz.isSubmit = true;
                                $(this).off("click");
                                tQuiz.takeAnswer();
                                setTimeout(tQuiz.nextQuestion(), 3000);
                            }
                        });
                    }
                    tQuiz.makeQuestion();
                }, 4000);
            } else {
                clearInterval(nextQInt);
                setTimeout(this.displayResults, 3000);
            }
        },
        makeQuestion: function () {
            $("#question-number").text("Question " + (tQuiz.currQ + 1) + ":");
            $("#trivia-question").html(tQuiz.quizQuestions[tQuiz.currQ]);
            $("#result-msg").empty();
            let ans = [];
            tQuiz.incorrectAnswers[tQuiz.currQ].forEach(function (e, i) {
                ans[i] = e;
            });
            ans.push(tQuiz.correctAnswers[tQuiz.currQ]);
            shuffleArray(ans);
            let ansButtons = $("<form>")
            ans.forEach(function (e) {
                let btnLabel = $("<label>");
                let btn = $("<input>");
                let q = "question-" + tQuiz.currQ;
                btn.attr({
                    type: "radio",
                    value: e.trim(),
                    name: q,
                    class: "m-2",
                });
                btnLabel.append(btn);
                btnLabel.append(e.trim());
                if (e === tQuiz.correctAnswers[tQuiz.currQ]) {
                    btnLabel.attr("data-correct-answer", "true");
                }
                ansButtons.append(btnLabel);
                ansButtons.append("<br>")
            });
            $("#answer-options").html(ansButtons);
        },
        displayResults: function () {
            $("#submit-button").css("display", "none");
            $(".card-text").empty();
            $("#question-number").text("Results:")
            $(".card-body").html("Correct answers: " + tQuiz.aCorrect + "<br>Wrong answers: " + tQuiz.aIncorrect + "<br>Unanswered: " + tQuiz.aUnanswered);
        }



    }
    //take the answer
    //show the right answer, show the wrong answer
    //wait 3 seconds

    // function countdown() {
    //     if (!answerSubmitted) {
    //         $("#question-timer").text((Math.floor(clockTime / 10)) ? "00:" + clockTime : "00:0" + clockTime);
    //         clockTime--;
    //     }
    //     if (clockTime < 0) {
    //         userAnswers[currQ] = $("input:checked").val();
    //         currQ++;
    //         if (currQ < apiQuestionsArray.length) {
    //             clearInterval(intervalId);
    //             clockTime = 30;
    //             nextQuestion();
    //             intervalId = setInterval(countdown, 1000);
    //         } else {
    //             clearInterval(intervalId);
    //             tallyAnswers();
    //         }
    //     }
    // }















});