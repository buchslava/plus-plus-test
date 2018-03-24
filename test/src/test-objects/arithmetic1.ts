import { AbstractTestObject } from "../../../src/abstract-test-object";

const ArithmeticsSource1 = require("./arithmetic-v1/index");

export class Arithmetic1 extends AbstractTestObject {
  getTitle(): string {
    return 'Arithmetic 1';
  }

  getObject() {
    return new ArithmeticsSource1();
  }

  getRootMethod(): string {
    return 'go';
  }
}
