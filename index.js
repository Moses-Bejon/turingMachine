import {tape} from "./tape.js"
import {head} from "./head.js"

/*
SAMPLE PROGRAM (Busy beaver Turing machine for 4 states)
0
~
0
~
0
~
A
~
A~0~1~right~B
A~1~1~left~B
B~0~1~left~A
B~1~0~left~C
C~0~1~right~H
C~1~1~left~D
D~0~1~right~D
D~1~0~right~A
*/

const programOutput = document.getElementById("programOutput")

function play(unTokenisedProgram) {
    /* TOKENISER: */

    const newSection = /\n~\n/

    const firstNewSectionPosition = unTokenisedProgram.search(newSection)

    const initialHeadPositionString = unTokenisedProgram.slice(0, firstNewSectionPosition)
    unTokenisedProgram = unTokenisedProgram.slice(firstNewSectionPosition + 3)

    const secondNewSectionPosition = unTokenisedProgram.search(newSection)

    const arrayTape = unTokenisedProgram.slice(0, secondNewSectionPosition).split("\n")
    unTokenisedProgram = unTokenisedProgram.slice(secondNewSectionPosition + 3)

    const thirdNewSectionPosition = unTokenisedProgram.search(newSection)

    const defaultSymbol = unTokenisedProgram.slice(0, thirdNewSectionPosition)
    unTokenisedProgram = unTokenisedProgram.slice(thirdNewSectionPosition + 3)

    const fourthNewSectionPosition = unTokenisedProgram.search(newSection)

    const startingState = unTokenisedProgram.slice(0, fourthNewSectionPosition)
    unTokenisedProgram = unTokenisedProgram.slice(fourthNewSectionPosition + 3)

    const stateTransitionFunction = []
    const stateTransitionPossibilities = unTokenisedProgram.split("\n")

    for (const stateTransitionPossibility of stateTransitionPossibilities) {
        const tokenisedStateTransitionPossibility = stateTransitionPossibility.split("~")
        stateTransitionFunction.push([tokenisedStateTransitionPossibility.slice(0, 2),
            tokenisedStateTransitionPossibility.slice(2, 5)])
    }

    /* PARSER */
    /* As the syntax of my language is so lenient, and the relations between tokens are extremely simple with 2 keywords (left and right), the parser is quite short */

    const initialHeadPosition = parseInt(initialHeadPositionString)
    if (isNaN(initialHeadPosition)){
        programOutput.innerText = "Error: The initial head position must be an integer"
        return
    }

    for (const stateTransitionPossibility of stateTransitionFunction){
        if (stateTransitionPossibility[1][1] !== "left" && stateTransitionPossibility[1][1] !== "right"){
            programOutput.innerText = "Error: You have a direction that is not specified to be either 'left' or 'right'"
            return
        }
    }

    /* RUN TIME */

    const tapeObject = new tape(arrayTape, defaultSymbol, initialHeadPosition)

    const headObject = new head(stateTransitionFunction, tapeObject, startingState)

    const iterator = headObject.step()

    function animate(){
        if (iterator.next().done){
            return
        }

        tapeObject.printTape()
        requestAnimationFrame(animate)
    }

    animate()
}

/* UI STUFF */

const languageHTML = document.createElement("div")
languageHTML.className = "input"
languageHTML.innerHTML = `
<textArea id="programInput"></textArea>
`

const inputsHTML = document.createElement("div")
inputsHTML.className = "input"
inputsHTML.innerHTML = `
<label for="initialHeadPosition">Initial head position:</label>
<input id="initialHeadPosition" type="number">

<br>

<label for="tape">Tape:</label>
<div id="tape">
    <input class="cell" type="text">
</div>

<br>

<label for="defaultSymbol">Symbol of all the cells surrounding the tape:</label>
<input id="defaultSymbol" type="text">

<br>

<label for="initialState">State that the Turing machine begins at:</label>
<input id="initialState" type="text">

<br>

<label for="stateTransitionFunction">State transition function:</label>
<div id="stateTransitionFunction"></div>
</div>
`

const input = document.getElementById("input")

let currentMode = "language"

function updateInputMode() {
    switch (currentMode) {

        case "language":
            currentMode = "inputs"

            input.replaceChildren(inputsHTML)

            break

        case "inputs":
            currentMode = "language"

            input.replaceChildren(languageHTML)

            break
    }
}

updateInputMode()

const headInput = document.getElementById("initialHeadPosition")

const tapeContainer = document.getElementById("tape")

const tapeInputs = []

const defaultSymbol = document.getElementById("defaultSymbol")

const initialState = document.getElementById("initialState")

let lastCell = document.querySelector(".cell")

function newCell(){

    lastCell.removeEventListener("input",newCell)
    tapeInputs.push(lastCell)

    lastCell = document.createElement("input")
    lastCell.className = "cell"
    lastCell.type = "text"
    lastCell.addEventListener("input",newCell)
    tapeContainer.appendChild(lastCell)
}

lastCell.addEventListener("input",newCell)

const stateTransitionFunctionContainer = document.getElementById("stateTransitionFunction")

const stateTransitionFunctionInputs = []

let lastStateTransitionPossibility = document.createElement("div")
newStateTransitionPossibility()

function newStateTransitionPossibility() {
    const allInputs = lastStateTransitionPossibility.querySelectorAll("input")

    for (const input of allInputs) {
        input.removeEventListener("input", newStateTransitionPossibility)
        stateTransitionFunctionInputs.push(input)
    }

    lastStateTransitionPossibility = document.createElement("div")
    lastStateTransitionPossibility.className = "stateTransitionPossibility"
    lastStateTransitionPossibility.innerHTML = `    
    <label for="selfStateID">Current state name: </label>
    <input type="text" class="selfStateID">
    <label for="tapeInput">Tape input: </label>
    <input type="text" class="tapeInput">
    <label for="tapeOutput">Tape output: </label>
    <input type="text" class="tapeOutput">
    <label for="direction">Direction (left/right): </label>
    <input type="text" class="directionInput">
    <label for="nextStateID">Next state name: </label>
    <input type="text" class="nextStateID">
    `

    stateTransitionFunctionContainer.appendChild(lastStateTransitionPossibility)

    for (const input of lastStateTransitionPossibility.querySelectorAll("input")){
        input.addEventListener("input",newStateTransitionPossibility)
    }
}

document.getElementById("playButton").onclick = () => {
    if (currentMode === "language") {
        play(document.getElementById("programInput").value)
    } else {
        let convertedToCode = ""

        convertedToCode += headInput.value + "\n~\n"

        for (const tapeInput of tapeInputs){
            convertedToCode += tapeInput.value + "\n"
        }

        convertedToCode += "~\n"+defaultSymbol.value + "\n~\n" + initialState.value + "\n~"

        for (let i = 0; i<stateTransitionFunctionInputs.length; i += 5){
            convertedToCode += "\n"+stateTransitionFunctionInputs[i].value+"~"+stateTransitionFunctionInputs[i+1].value+"~"+stateTransitionFunctionInputs[i+2].value+"~"+stateTransitionFunctionInputs[i+3].value+"~"+stateTransitionFunctionInputs[i+4].value
        }

        console.log("The program generated by your UI choices is given:")
        console.log(convertedToCode)

        play(convertedToCode)
    }
}

document.getElementById("switchInputMode").onclick = updateInputMode
