$(document).ready(function () {

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    queryURL = "https://opentdb.com/api.php?amount=10&category=11&difficulty=medium&type=multiple"
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        let clockTime = 30;
        let currentQuestion = 0;
        let userAnswers = [];
        let correctAnswers = [];
        let answerSubmitted = false;

        console.log(response);
        apiQuestionsArray = response.results;
        nextQuestion();
        $("#answer-button").click(function checkAnswer() {
            $("#answer-button").off("click");
            answerSubmitted = true;
            userAnswers[currentQuestion] = $("input:checked").val();
            if (userAnswers[currentQuestion] === correctAnswers[currentQuestion]) {
                $("*[data-correct-answer").css("color","green");
                let rightWrongMessage = $("<div>");
                rightWrongMessage.addClass("card-text text-center text-success");
                rightWrongMessage.attr("data-rwm","rwm");
                rightWrongMessage.text("Correct!");
                $(".card-body").append(rightWrongMessage);
            } else {
                $("*[data-correct-answer]").css("color","green");
                $("input:checked").parent().css("color","red");
                let rightWrongMessage = $("<div>");
                rightWrongMessage.addClass("card-text text-center text-danger");
                rightWrongMessage.attr("data-rwm","rwm");
                rightWrongMessage.text("Incorrect!");
                $(".card-body").append(rightWrongMessage);
            }
            setTimeout(function () {
                $("*[data-rwm]").remove();
                answerSubmitted = false;
                clockTime = 30;
                currentQuestion++;
                if (currentQuestion < apiQuestionsArray.length) {
                    $("#answer-button").on("click", checkAnswer);
                    nextQuestion();
                } else {
                    clearInterval(intervalId);
                    $(this).off("click");
                    tallyAnswers();
                }
            }, 2000)
        });
        function countdown() {
            if (!answerSubmitted) {
                $("#question-timer").text((Math.floor(clockTime / 10)) ? "00:" + clockTime : "00:0" + clockTime);
                clockTime--;
            }
            if (clockTime < 0) {
                userAnswers[currentQuestion] = $("input:checked").val();
                currentQuestion++;
                if (currentQuestion < apiQuestionsArray.length) {
                    clearInterval(intervalId);
                    clockTime = 30;
                    nextQuestion();
                    intervalId = setInterval(countdown, 1000);
                } else {
                    clearInterval(intervalId);
                    tallyAnswers();
                }
            }
        }

        intervalId = setInterval(countdown, 1000);

        function nextQuestion() {

            $("#question-number").text("Question " + (currentQuestion + 1) + ":");
            $("#trivia-question").html(apiQuestionsArray[currentQuestion].question);
            let ansButtons = $("<form>")
            correctAnswers[currentQuestion] = apiQuestionsArray[currentQuestion].correct_answer;
            let correctPlusIncorrect = apiQuestionsArray[currentQuestion].incorrect_answers;
            correctPlusIncorrect.push(apiQuestionsArray[currentQuestion].correct_answer);
            shuffleArray(correctPlusIncorrect);
            correctPlusIncorrect.forEach(function (e) {
                let btnLabel = $("<label>");
                let btn = $("<input>");
                btn.attr("type", "radio");
                btn.attr("value", e.trim());
                btn.attr("name", "question-" + currentQuestion);
                btn.addClass("m-2");
                btnLabel.append(btn);
                btnLabel.append(e.trim());
                if (e === apiQuestionsArray[currentQuestion].correct_answer) {
                    btnLabel.attr("data-correct-answer", "true");
                }
                ansButtons.append(btnLabel);
                ansButtons.append("<br>")
            });
            $("#answer-options").html(ansButtons);
        }
        function tallyAnswers() {
            console.log(userAnswers);
            console.log(correctAnswers);
            let numCorrect = 0;
            let numWrong = 0;
            let numUnanswered = 0;
            userAnswers.forEach(function (e, i) {
                if (e) {
                    if (e === correctAnswers[i]) {
                        numCorrect++;
                    } else {
                        numWrong++;
                    }
                } else {
                    numUnanswered++;
                }
            });

            $("#answer-button").css("display", "none");
            $(".card-text").empty();
            $("#question-number").text("Results:")
            $(".card-body").html("Correct answers: " + numCorrect + "<br>Wrong answers: " + numWrong + "<br>Unanswered: " + numUnanswered);
        }




    });
















});