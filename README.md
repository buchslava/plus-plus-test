# ++tests

This repository contains basic concepts and an example of approach to create `++tests`. It means more than tests in classic meaning. Apart from traditional question "Does it work?" `++tests` can answer next questions:

* Does they work?
* How quick they work?
* Why some of tests should not be available?
* Can I get more information regarding testing process?
* Can I work with the result of testing quickly?

So, what difference between "it" and "they"? This is a simple idea. `++tests` should be able to test groups of objects that should provide same result on same input data. It can be objects with quite different implementations and versions of same object. 

There are four basic concepts:

* Test Object
* Data Suite
* Test Object Groups
* Test Suite
* Assert Pattern

Let me explain...

## Test Object

`Test Object` is a wrapper on 'real' object that we want to test.

For example, we have next functionality that should be tested:

`test/src/test-objects/arithmetic-v1/index.js`
```javascript
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
```

In this case `Test Object` will be:

`test/src/test-objects/arithmetic1.ts`
```typescript
import { AbstractTestObject } from "../../../src/abstract-test-object";

const ArithmeticsSource1 = require("./arithmetic-v1/index");

export class Arithmetic1 extends AbstractTestObject {
  getTitle(): string {
    return 'Arithmetic 1';
  }

  getObject() {
    return new ArithmeticsSource1();
  }

  // see method 'go' in `test/src/test-objects/arithmetic-v1/index.js`
  getRootMethod(): string {
    return 'go';
  }
}
```

Any test object should be an implementation of `AbstractTestObject` class and should contain next basic overrided methods:

* `getTitle` - returns title of this `Test Object`, it will be used as a part of label of the test
* `getObject` - returns just created instance that sould be tested
* `getRootMethod` - return name of method from instance that sould be tested

Also, we have second one:
`test/src/test-objects/arithmetic-v2/index.js`
```javascript
const ops = {
    add: (a, b) => a + b,
    sub: (a, b) => a - b,
    mul: (a, b) => a * b,
    div: (a, b) => {
        if (a === 0 && b === 0) {
            return {error: 'Infinity result: 0/0'};
        }

        if (b === 0) {
            return {error: 'Division by zero'}
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
```

Second one `Test Object` will be same:

`test/src/test-objects/arithmetic2.ts`
```typescript
import { AbstractTestObject } from "../../../src/abstract-test-object";

const ArithmeticsSource1 = require("./arithmetic-v2/index");

export class Arithmetic1 extends AbstractTestObject {
  getTitle(): string {
    return 'Arithmetic 2';
  }

  getObject() {
    return new ArithmeticsSource1();
  }

  getRootMethod(): string {
    return 'go';
  }
}
```

That's all regarding `Test Object`

## Data Suite

`Data Suite` is a record from the registry that describes particular set of data.

For example,

`test/src/definitions/data-suite-registry.ts`
```typescript
import { DataSuite } from "../../../src/data-suite";

export const oneDigit = new DataSuite("one-digit", "One digit");
export const twoDigits = new DataSuite("two-digits", "Two digits");
export const miscNumbers = new DataSuite("misc", "Misc numbers");
``` 

## Test Object Groups


```typescript
import { oneDigit, twoDigits, miscNumbers } from "./data-suite-registry";
import { AbstractTestObject } from "../../../src/abstract-test-object";
import { Arithmetic1 } from "../test-objects/arithmetic1";
import { Arithmetic2 } from "../test-objects/arithmetic2";

const oneDigitFixture = require("../../data/fixtures/input-data/one-digit.json");
const twoDigitsFixture = require("../../data/fixtures/input-data/two-digits.json");
const miscFixture = require("../../data/fixtures/input-data/misc.json");

export const getTestObjectGroups = (): AbstractTestObject[] => [
  new Arithmetic1()
    .forDataSuite(oneDigit)
    .init(oneDigitFixture),
  new Arithmetic2()
    .forDataSuite(oneDigit)
    .init(oneDigitFixture),
  new Arithmetic1()
    .forDataSuite(twoDigits)
    .init(twoDigitsFixture),
  new Arithmetic2()
    .forDataSuite(twoDigits)
    .init(twoDigitsFixture),
  new Arithmetic1()
    .forDataSuite(miscNumbers)
    .init(miscFixture),
  new Arithmetic2()
    .forDataSuite(miscNumbers)
    .init(miscFixture)
];
```

## Assert Pattern

```typescript
export abstract class AbstractAssertPattern {

  constructor(protected fixture) {
  }

  abstract processAssert(err, data, dataSuiteSuffix: string, testIndex: number);
}
```

just links...

## Test Suite

```typescript
import { printSummaryTable, runTests } from "../src/test-runner";
import { TestSuite } from "../src/test-suite";
import { Arithmetic1 } from './src/test-objects/arithmetic1';
import { miscNumbers } from "./src/definitions/data-suite-registry";
import { getTestObjectGroups } from "./src/definitions/test-object-groups";
import { GenericAssertPattern } from "./src/definitions/assert-patterns/generic-assert-pattern";

describe('Division supporting', () => {
    const aggregatedData = {};
    const testSuites = [
        new TestSuite()
            .forDataSuite(miscNumbers)
            .postponeFor('Error processing for div operation was NOT supported', Arithmetic1)
            .withTitle('div operation for different values')
            .withFixture('div-#datasource#.json')
            .withInputData('div')
            .withAssertPattern(GenericAssertPattern)
    ];

    after(() => {
        printSummaryTable(testSuites, aggregatedData);
    });

    runTests(getTestObjectGroups, testSuites, aggregatedData);
});
```