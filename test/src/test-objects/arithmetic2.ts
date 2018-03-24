import { AbstractTestObject } from "../../../src/abstract-test-object";

const ArithmeticsSource2 = require("./arithmetic-v2/index");

export class Arithmetic2 extends AbstractTestObject {
  getTitle(): string {
    return 'Arithmetic 2';
  }

  getObject() {
    return new ArithmeticsSource2();
  }

  getRootMethod(): string {
    return 'go';
  }
}
