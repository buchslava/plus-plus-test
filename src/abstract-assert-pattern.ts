export abstract class AbstractAssertPattern {

  constructor(protected fixture) {
  }

  abstract processAssert(err, data, dataSuiteSuffix: string, testIndex: number);
}
