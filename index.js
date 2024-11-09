import {tape} from "./tape.js"
import {head} from "./head.js"

let unTokenisedProgram = `0
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
D~1~0~right~A`

const newSection = /\n~\n/

const firstNewSectionPosition = unTokenisedProgram.search(newSection)

const initialHeadPosition = parseInt(unTokenisedProgram.slice(0,firstNewSectionPosition))
unTokenisedProgram = unTokenisedProgram.slice(firstNewSectionPosition+3)

const secondNewSectionPosition = unTokenisedProgram.search(newSection)

const arrayTape = unTokenisedProgram.slice(0,secondNewSectionPosition).split("\n")
unTokenisedProgram = unTokenisedProgram.slice(secondNewSectionPosition+3)

const thirdNewSectionPosition = unTokenisedProgram.search(newSection)

const defaultSymbol = unTokenisedProgram.slice(0,thirdNewSectionPosition)
unTokenisedProgram = unTokenisedProgram.slice(thirdNewSectionPosition+3)

const tapeObject = new tape(arrayTape,defaultSymbol,initialHeadPosition)

const fourthNewSectionPosition = unTokenisedProgram.search(newSection)

const startingState = unTokenisedProgram.slice(0,fourthNewSectionPosition)
unTokenisedProgram = unTokenisedProgram.slice(fourthNewSectionPosition+3)

const stateTransitionFunction = []
const stateTransitionPossibilities = unTokenisedProgram.split("\n")

for (const stateTransitionPossibility of stateTransitionPossibilities){
    const tokenisedStateTransitionPossibility = stateTransitionPossibility.split("~")
    stateTransitionFunction.push([tokenisedStateTransitionPossibility.slice(0,2),
        tokenisedStateTransitionPossibility.slice(2,5)])
}

const headObject = new head(stateTransitionFunction,tapeObject,startingState)

const iterator = headObject.step()


for (const _ of iterator){
}
tapeObject.printTape()

/*
document.addEventListener("keypress",()=>{
    iterator.next()
    tapeObject.printTape()
})*/