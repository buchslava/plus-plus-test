import { printSummaryTable, runTests } from "../src/test-runner";
import { TestSuite } from "../src/test-suite";
import { oneDigit, twoDigits } from "./src/definitions/data-suite-registry";
import { getTestObjectGroups } from "./src/definitions/test-object-groups";
import { PreciseAssertPattern } from "./src/definitions/assert-patterns/precise-assert-pattern";

describe('Multiplication supporting', () => {
    const aggregatedData = {};
    const testSuites = [
        new TestSuite()
            .forDataSuite(oneDigit)
            .withTitle('mul operation for values LESS than 10')
            .withFixture('mul-#datasource#.json')
            .withInputData('mul')
            .withAssertPattern(PreciseAssertPattern),
        new TestSuite()
            .forDataSuite(twoDigits)
            .withTitle('mul operation for values MORE than 10')
            .withFixture('mul-#datasource#.json')
            .withInputData('mul')
            .withAssertPattern(PreciseAssertPattern)
    ];

    after(() => {
        printSummaryTable(testSuites, aggregatedData);
    });

    runTests(getTestObjectGroups, testSuites, aggregatedData);
});
