class Processor {
    process(inputA, inputB) {
        return inputA + inputB;
    }
}

class Adder {
    constructor(processor = new Processor()) {
        this.processor = processor;
    }

    add(a, b) {
        let validation = a !== b;

        if (!validation) {
            throw new Error('Invalid Arguments!');
        }

        let result = this.processor.process(a, b);

        return result;
    }
}

module.exports = {
    Adder,
    Processor
};
