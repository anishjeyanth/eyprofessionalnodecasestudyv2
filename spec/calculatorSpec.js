describe('calculator test suite', () => {
    let { Adder, Processor } = require('../poc/calculator');

    let adder = null;
    let processor = null;

    beforeEach(() => {
        processor = new Processor();
        adder = new Adder(processor);

        spyOn(processor, 'process').and.callThrough();
    });

    it('should add() return added data', () => {
        let inputA = 10;
        let inputB = 20;
        let expectedOutput = 30;
        let actualOutput = adder.add(inputA, inputB);

        expect(processor.process).toHaveBeenCalledTimes(1);
        expect(processor.process).toHaveBeenCalledWith(inputA, inputB);
        expect(actualOutput).toBe(expectedOutput);
    });


    afterEach(() => {
        console.log('Test cleanup!');
    })
});