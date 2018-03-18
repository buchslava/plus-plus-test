import { DataSuite } from "./data-suite";

export abstract class AbstractTestObject {
  dataSuite: DataSuite;
  private initData;
  private object;

  abstract getTitle(): string;

  abstract getObject();

  abstract getRootMethod(): string;

  forDataSuite(dataSuite: DataSuite) {
    this.dataSuite = dataSuite;

    return this;
  }

  init(initData) {
    this.initData = initData;

    this.object = this.getObject();
    this.object.init(initData);

    return this;
  }

  run(request, onRead) {
    const result = this.object[this.getRootMethod()](request);

    onRead(null, result);
  }
}
