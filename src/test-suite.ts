import { isEmpty } from "lodash";
import { DataSuite } from "./data-suite";
import { AbstractTestObject } from "./abstract-test-object";
import { AbstractAssertPattern } from "./abstract-assert-pattern";

export class TestSuite {
  title: string;
  fixture: string;
  inputData;
  assertPattern;
  dataSources: DataSuite[] = [];
  postponed: (typeof AbstractTestObject)[] = [];
  postponeReason: string;

  withTitle(title: string) {
    this.title = title;

    return this;
  }

  withFixture(fixture: string) {
    this.fixture = fixture;

    return this;
  }

  withInputData(inputData) {
    this.inputData = inputData;

    return this;
  }

  withAssertPattern(assertPattern: typeof AbstractAssertPattern) {
    this.assertPattern = assertPattern;

    return this;
  }

  forDataSuite(dataSuite: DataSuite) {
    this.dataSources.push(dataSuite);

    return this;
  }

  postponeFor(postponeReason: string, ...testObject: (typeof AbstractTestObject)[]) {
    this.postponed.push(...testObject);
    this.postponeReason = postponeReason;

    return this;
  }
}
