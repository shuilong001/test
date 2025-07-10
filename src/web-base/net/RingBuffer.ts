import { EncodeUtils } from "./EncodeUtils";

export class RingBuffer {
    private size = 0;
    private list: any = [];
    // private capacity = 0;
    private head = 0;
    private tail = 0;

    constructor() {
        this.initQueue(4 * 1024 * 1024); //size必须是2的n次方
    }
    //初始化队列
    initQueue(size: number) {
        this.size = this.FixLength(size);
        this.list = new Array();
        // this.capacity = size + 1;
        this.head = 0;
        this.tail = 0;
    }

    FixLength(length: number) {
        var n = 2;
        var b = 2;
        while (b < length) {
            b = 2 << n;
            n++;
        }
        return b;
    }

    //压入队列
    Push(ele: null) {
        if (typeof ele == undefined || ele == null) {
            return;
        }

        if (this.list != null) {
            this.list[this.tail & (this.size - 1)] = ele;
            this.tail++;
        }
    }

    Pop() {
        if (this.tail == this.head || this.list == null) {
            return null;
        }

        return this.list[this.head++ & (this.size - 1)];
    }

    Pop2(index: number) {
        if (this.tail == this.head || this.list == null) {
            return null;
        }

        return this.list[(this.head + index) & (this.size - 1)];
    }

    DataLength() {
        return (this.tail - this.head) & (this.size - 1);
    }

    addHead(offset: number) {
        this.head += offset;
    }

    Clear() {
        this.head = 0;
        this.tail = 0;
    }

    decode_msg_total_length() {
        let bodyLen = EncodeUtils.decode_msg_total_length(this.list, this.head);
        return bodyLen;
    }

    decode_msg_id() {
        let msgID = EncodeUtils.ByteTouInt32(this.list, this.head);
        this.addHead(4);
        return msgID;
    }

    decode_msg_body(message: () => any, bodyLen: number) {
        let tb = message();
        tb.decode(this.list, this.head);
        this.addHead(bodyLen);
        return tb;
    }
}
