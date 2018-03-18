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
