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
