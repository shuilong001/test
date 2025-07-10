export class MessageMap {
  private static msgMap: any = {}

  static addMsgMap(msgStruct: any) {
    const msgID = msgStruct().getMsgID()
    this.msgMap[msgID] = msgStruct
  }

  static getMessage(msgID: number) {
    return this.msgMap[msgID]
  }
}
