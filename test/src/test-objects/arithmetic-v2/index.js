const ops = {
    add: (a, b) => a + b,
    sub: (a, b) => a - b,
    mul: (a, b) => a * b,
    div: (a, b) => {
        if (a === 0 && b === 0) {
            return { error: 'Infinity result: 0/0' };
        }

        if (b === 0) {
            return { error: 'Division by zero' }
        }

        return a / b;
    }
};
const getOp = (opName) => ops[opName];

module.exports = class Arichmetic {
    init(source) {
        this.source = source;
        this.result = [];
    }

    go(op) {
        for (const item of this.source) {
            const newItem = Object.assign({}, item);

            newItem.result = getOp(op)(item.a, item.b);
            this.result.push(newItem);
        }

        return this.result;
    }
}
