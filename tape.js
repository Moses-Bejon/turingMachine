export class tape{
    constructor(knownTape,restOfTape,initialHeadPosition) {
        const firstSymbol = new symbol(restOfTape)

        this.currentSymbol = firstSymbol

        for (const symbol of knownTape){
            this.currentSymbol.value = symbol
            this.currentSymbol = this.currentSymbol.right()
        }

        this.currentSymbol = firstSymbol

        if (initialHeadPosition > 0){
            for (let i = 0; i<initialHeadPosition; i++){
                this.right()
            }
        } else if (initialHeadPosition < 0){
            for (let i = 0; i<-initialHeadPosition; i++){
                this.left()
            }
        }
    }
    
    read(){
        return this.currentSymbol.value
    }

    write(value){
        this.currentSymbol.value = value
    }

    left(){
        this.currentSymbol = this.currentSymbol.left()
    }

    right(){
        this.currentSymbol = this.currentSymbol.right()
    }

    // should be used only for debugging, as not optimised:
    printTape(){
        const tapeArray = []

        let currentTapePlace = this.currentSymbol

        while (currentTapePlace.leftSymbol !== undefined){
            currentTapePlace = currentTapePlace.leftSymbol
        }

        if (currentTapePlace === this.currentSymbol && false) {
            tapeArray.push("!"+currentTapePlace.value)
        } else{
            tapeArray.push(currentTapePlace.value)
        }
        while (currentTapePlace.rightSymbol !== undefined){
            currentTapePlace = currentTapePlace.rightSymbol
            if (currentTapePlace === this.currentSymbol && false) {
                tapeArray.push("!"+currentTapePlace.value)
            } else{
                tapeArray.push(currentTapePlace.value)
            }
        }

        document.getElementById("programOutput").innerText = tapeArray
    }
}

class symbol{
    constructor(defaultSymbol) {
        this.defaultSymbol = defaultSymbol
        this.value = defaultSymbol
    }

    right() {

        if (this.rightSymbol === undefined){
            this.rightSymbol = new symbol(this.defaultSymbol)
            this.rightSymbol.leftSymbol = this
        }

        return this.rightSymbol
    }
    
    left() {
        if (this.leftSymbol === undefined){
            this.leftSymbol = new symbol(this.defaultSymbol)
            this.leftSymbol.rightSymbol = this
        }

        return this.leftSymbol
    }
}