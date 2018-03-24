import * as path from "path";
import * as rimraf from "rimraf";
import * as colors from "colors";
import { table } from "table";
import { head, keys, isEmpty, split, nth, noop, cloneDeep } from "lodash";
import { TestSuite } from "./test-suite";
import { AbstractAssertPattern } from "./abstract-assert-pattern";
import { AbstractTestObject } from "./abstract-test-object";
import { performance } from 'perf_hooks';

function* indexMaker() {
  let index = 1;

  while (true) {
    yield index++;
  }
}

const testIndex = indexMaker();

const dir = path.resolve(__dirname, '..', 'test', 'result');

rimraf.sync(dir);

function postponeReasonExplanation(testSuites: TestSuite[]) {
  const reasons = testSuites
    .filter(testSuite => !isEmpty(testSuite.postponed) && !isEmpty(testSuite.postponeReason))
    .map(testSuite => [testSuite.title, testSuite.postponeReason]);

  if (isEmpty(reasons)) {
    return '';
  }

  return colors.blue('Postpone details:') + '\n' +
    colors.white(table([['Test', 'Reason'], ...reasons]));
}

export function printSummaryTable(testCases: TestSuite[], aggregatedData) {
  const testTitles = keys(aggregatedData);
  const testObjectTitles = keys(aggregatedData[head(testTitles)]);

  const tableData = [
    ['Test', ...(testObjectTitles.map(title => `${title}, ms`))]
  ];

  for (const testTitle of testTitles) {
    const rowData = [testTitle];

    for (const testObjectTitle of testObjectTitles) {
      if (aggregatedData[testTitle][testObjectTitle]) {
        rowData.push(aggregatedData[testTitle][testObjectTitle].executionTime);
      } else {
        rowData.push('');
      }
    }

    tableData.push(rowData);
  }

  const output = `${colors.yellow(table(tableData))}${postponeReasonExplanation(testCases)}`;

  console.log(output);
}

function isTestCaseShouldBeOmitted(testSuite: TestSuite, testObject: AbstractTestObject) {
  if (!isEmpty(testSuite.postponed)) {
    for (const postponedTestObject of testSuite.postponed) {
      const getClassName = classDetails => nth(split(classDetails.valueOf(), ' '), 1);

      if (getClassName(postponedTestObject) === testObject.constructor.name) {
        return true;
      }
    }
  }

  return false;
}

export function runTests(getTestObjectsGroups: Function, testSuites: TestSuite[], aggregatedData = {}) {
  for (const testSuite of testSuites) {
    for (const dataset of testSuite.dataSources) {
      const testSuiteTitleWithDataset = `${testSuite.title} on "${dataset.name}"`;

      aggregatedData[testSuiteTitleWithDataset] = {};

      const testObjects = getTestObjectsGroups();

      for (const testObject of testObjects) {
        if (dataset === testObject.dataSuite) {
          aggregatedData[testSuiteTitleWithDataset][testObject.getTitle()] = {
            executionTime: null
          };

          const title = `"${testObject.getTitle()}" on "${testObject.dataSuite.title} (${testObject.dataSuite.name})": ${testSuite.title}`;
          const flow = new testSuite.assertPattern(testSuite.fixture);

          if (isTestCaseShouldBeOmitted(testSuite, testObject)) {
            if (aggregatedData[testSuiteTitleWithDataset][testObject.getTitle()]) {
              aggregatedData[testSuiteTitleWithDataset][testObject.getTitle()].executionTime = '***';
            }

            xit(`${title}`, noop);
          } else {
            const currentTestIndex = testIndex.next().value;

            it(`${title} [#${currentTestIndex}]`, done => {
              const timeStart = performance.now();

              testObject.run(testSuite.inputData, (err, data) => {
                const timeFinish = performance.now();

                if (aggregatedData[testSuiteTitleWithDataset][testObject.getTitle()]) {
                  aggregatedData[testSuiteTitleWithDataset][testObject.getTitle()].executionTime = Number((timeFinish - timeStart).toFixed(3));
                }

                try {
                  flow.processAssert(err, data, testObject.dataSuite.name, currentTestIndex);

                  done();
                } catch (err) {
                  done(err);
                }
              });
            });
          }
        }
      }
    }
  }
}
