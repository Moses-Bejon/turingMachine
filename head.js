export class head{
    constructor(stateTransitionFunction,tape,startingState){
        this.stateTransitionFunction = new Map()
        for (const stateTransitionPossibility of stateTransitionFunction){

            let stateTransitionMap = this.stateTransitionFunction.get(stateTransitionPossibility[0][0])

            if (stateTransitionMap === undefined){
                stateTransitionMap = new Map()
                this.stateTransitionFunction.set(stateTransitionPossibility[0][0],stateTransitionMap)
            }

            stateTransitionMap.set(stateTransitionPossibility[0][1],stateTransitionPossibility[1])
        }

        this.tape = tape
        this.currentState = startingState
    }

    * step(){

        while (true) {

            const stateTransition = this.stateTransitionFunction.get(this.currentState)?.get(this.tape.read())

            if (stateTransition === undefined) {
                return
            }

            this.tape.write(stateTransition[0])

            if (stateTransition[1] === "right") {
                this.tape.right()
            } else if (stateTransition[1] === "left") {
                this.tape.left()
            } else {
                return
            }

            this.currentState = stateTransition[2]

            yield

        }
    }
}