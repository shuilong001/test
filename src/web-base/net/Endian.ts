export class Endian {
  public static instance = new Endian();
  bigEndian = false;
  constructor() {
    this.bigEndian = this.IsbigEndian();
  }

  IsbigEndian() {
    var buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true);
    return new Int16Array(buffer)[1] === 256;
  }
}
