const ops = {
    add: (a, b) => a + b,
    sub: (a, b) => a - b,
    mul: (a, b) => a * b,
    div: (a, b) => a / b
};
const getOp = (opName) => ops[opName];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

module.exports = class Arichmetic {
    init(source) {
        this.source = source;
        this.result = [];
    }

    go(op) {
        for (const item of this.source) {
            const newItem = Object.assign({}, item);

            newItem.result = getOp(op)(item.a, item.b);

            for (let i = 0; i < getRandomInt(1000, 99999); i++);

            this.result.push(newItem);
        }

        return this.result;
    }
}
