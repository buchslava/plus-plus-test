import * as chai from "chai";
import * as path from "path";
import { isEmpty, keys, cloneDeep } from "lodash";
import * as base64 from "base-64";
import * as reduce from "object.reduce";
import { AbstractAssertPattern } from "../../../../src/abstract-assert-pattern";
import { writeUsefultTestInformation } from "./utils";

const expect = chai.expect;

export class GenericAssertPattern extends AbstractAssertPattern {
  processAssert(err, data, dataSuiteSuffix: string, testIndex: number) {
    const fixturePath = path.resolve(
      __dirname, "..", "..", "..", "data/fixtures/result", 
      this.fixture.replace(/#datasource#/, dataSuiteSuffix));
    const fixtureData = require(fixturePath);
    const areEqual = this.equals(data, fixtureData);
    const fixtureDataStr = JSON.stringify(fixtureData, null, 2);
    const dataStr = JSON.stringify(data, null, 2);

    expect(!err).to.be.true;
    expect(data.length).to.equal(fixtureData.length);
    try {
      expect(areEqual).to.be.true;
    } catch (err) {
      writeUsefultTestInformation(testIndex, fixtureDataStr, dataStr);

      throw err;
    }
  }

  private equals(firstObject, secondObject) {
    if (firstObject.length !== secondObject.length) {
      return false;
    }

    const getObjectWithStringifiedValues = obj => {
      return reduce(obj, (agg, value, key) => {
        agg[key] = `${value}`;

        return agg;
      }, {});
    };
    const getObjectWithStringifiedObjects = a => a.map(a1 => getObjectWithStringifiedValues(a1));

    const seenHash = {};
    const aa = getObjectWithStringifiedObjects(firstObject);
    const bb = getObjectWithStringifiedObjects(secondObject);

    for (const o of aa) {
      const key = new Buffer(JSON.stringify(o, Object.keys(o).sort())).toString('base64');

      if (!seenHash[key]) {
        seenHash[key] = 0;
      }

      seenHash[key]++;
    }

    for (const o of bb) {
      const key = new Buffer(JSON.stringify(o, Object.keys(o).sort())).toString('base64');

      if (!seenHash[key] && seenHash[key] !== 0) {
        return false;
      }

      seenHash[key]--;
    }

    return isEmpty(keys(seenHash).filter(key => seenHash[key] > 0))
  }
}
