export class MessageMap {
    private static msgMap: any = {};

    static addMsgMap(msgStruct: any) {
        let msgID = msgStruct().getMsgID();
        this.msgMap[msgID] = msgStruct;
    }

    static getMessage(msgID: number) {
        return this.msgMap[msgID];
    }
}
