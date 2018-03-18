import { printSummaryTable, runTests } from "../src/test-runner";
import { TestSuite } from "../src/test-suite";
import { oneDigit, twoDigits } from "./src/definitions/data-suite-registry";
import { getTestObjectGroups } from "./src/definitions/test-object-groups";
import { GenericAssertPattern } from "./src/definitions/assert-patterns/generic-assert-pattern";

describe('Addition supporting', () => {
    const aggregatedData = {};
    const testSuites = [
        new TestSuite()
            .forDataSuite(oneDigit)
            .withTitle('add operation for values LESS than 10')
            .withFixture('add-#datasource#.json')
            .withInputData('add')
            .withAssertPattern(GenericAssertPattern),
        new TestSuite()
            .forDataSuite(twoDigits)
            .withTitle('add operation for values MORE than 10')
            .withFixture('add-#datasource#.json')
            .withInputData('add')
            .withAssertPattern(GenericAssertPattern)
    ];

    after(() => {
        printSummaryTable(testSuites, aggregatedData);
    });

    runTests(getTestObjectGroups, testSuites, aggregatedData);
});
