import { Endian } from "./Endian";

export module EncodeUtils {
    export function decode_msg_total_length(buf: { [x: string]: number; }, index: number) {
        let value = ((buf[index] & 0xff) << 24) | ((buf[index + 1] & 0xff) << 16) | ((buf[index + 2] & 0xff) << 8) | (buf[index + 3] & 0xff);

        return value;
    }

    export function encode_msg_total_length(i: number, buf: any[]) {
        buf.push(i & 0xff);
        buf.push((i >> 8) & 0xff);
        buf.push((i >> 16) & 0xff);
        buf.push((i >> 24) & 0xff);
    }

    export function swab32_msg_total_length(x: number) {
        let ret = ((x & 0x000000ff) << 24) | ((x & 0x0000ff00) << 8) | ((x & 0x00ff0000) >> 8) | ((x & 0xff000000) >> 24);
        return ret;
    }

    //编码，注意这下面的函数，都是用来编解码，其中字符串相关函数里面加了字符串长度的编码，不能直接正常使用
    export function stringToByte(this: any, str: string, buf: number[]) {
        var len, c;
        len = str.length;
        if (len > 0) {
            this.uInt16ToByte(len, buf); //先把字符串的长度编码
            for (var i = 0; i < len; i++) {
                c = str.charCodeAt(i);
                if (c >= 0x010000 && c <= 0x10ffff) {
                    buf.push(((c >> 18) & 0x07) | 0xf0);
                    buf.push(((c >> 12) & 0x3f) | 0x80);
                    buf.push(((c >> 6) & 0x3f) | 0x80);
                    buf.push((c & 0x3f) | 0x80);
                } else if (c >= 0x000800 && c <= 0x00ffff) {
                    buf.push(((c >> 12) & 0x0f) | 0xe0);
                    buf.push(((c >> 6) & 0x3f) | 0x80);
                    buf.push((c & 0x3f) | 0x80);
                } else if (c >= 0x000080 && c <= 0x0007ff) {
                    buf.push(((c >> 6) & 0x1f) | 0xc0);
                    buf.push((c & 0x3f) | 0x80);
                } else {
                    buf.push(c & 0xff);
                }
            }
        }

        return buf;
    }

    //utf8字符串转字节数组
    export function utf8StrtoBytes(this: any, text: string, buf: number[]) {
        var i = 0;
        text = encodeURI(text);

        //先计算出字符串的长度
        let textLen = 0;
        while (i < text.length) {
            var c = text.charCodeAt(i++);
            // if it is a % sign, encode the following 2 bytes as a hex value
            if (c === 37) {
                i += 2;
                textLen++;
                // otherwise, just the actual byte
            } else {
                textLen++;
            }
        }

        this.uInt16ToByte(textLen, buf); //先把字符串的长度编码

        i = 0;
        while (i < text.length) {
            var c = text.charCodeAt(i++);

            // if it is a % sign, encode the following 2 bytes as a hex value
            if (c === 37) {
                buf.push(parseInt(text.substr(i, 2), 16));
                i += 2;
                // otherwise, just the actual byte
            } else {
                buf.push(c);
            }
        }
    }

    export function int32ToByte(i: number, buf: number[]) {
        if (Endian.instance.bigEndian) {
            buf.push((i >> 24) & 0xff);
            buf.push((i >> 16) & 0xff);
            buf.push((i >> 8) & 0xff);
            buf.push(i & 0xff);
        } else {
            buf.push(i & 0xff);
            buf.push((i >> 8) & 0xff);
            buf.push((i >> 16) & 0xff);
            buf.push((i >> 24) & 0xff);
        }
    }
    export function uInt32ToByte(this: any, i: number, buf: any) {
        this.int32ToByte(i, buf);
    }
    export function int64ToByte(this: any, i: any, buf: number[]) {
        let value = this.getHAndLBitFromNumber(i);
        let h = value[0];
        let l = value[1];
        if (Endian.instance.bigEndian) {
            buf.push((h >> 24) & 0xff);
            buf.push((h >> 16) & 0xff);
            buf.push((h >> 8) & 0xff);
            buf.push(h & 0xff);

            buf.push((l >> 24) & 0xff);
            buf.push((l >> 16) & 0xff);
            buf.push((l >> 8) & 0xff);
            buf.push(l & 0xff);
        } else {
            buf.push(l & 0xff);
            buf.push((l >> 8) & 0xff);
            buf.push((l >> 16) & 0xff);
            buf.push((l >> 24) & 0xff);

            buf.push(h & 0xff);
            buf.push((h >> 8) & 0xff);
            buf.push((h >> 16) & 0xff);
            buf.push((h >> 24) & 0xff);
        }
    }

    export function uInt16ToByte(s: number, buf: number[]) {
        if (Endian.instance.bigEndian) {
            buf.push((s >> 8) & 0xff);
            buf.push(s & 0xff);
        } else {
            buf.push(s & 0xff);
            buf.push((s >> 8) & 0xff);
        }
    }
    export function int16ToByte(this: any, s: number, buf: any) {
        if (s >= 0) {
            this.uInt16ToByte(s, buf);
        } else {
            this.uInt16ToByte(s + 65536, buf);
        }
    }

    export function int8ToByte(u: number, buf: number[]) {
        buf.push(u & 0xff);
    }

    export function uInt8ToByte(this: any, u: number, buf: number[]) {
        this.int8ToByte(u, buf);
    }

    ////////////////////////////////////////////////////////////////////////////////////////
    //解码
    export function byteToString(this: any, buf: never[], index: number) {
        if (typeof buf === "string") {
            return buf;
        }
        //先解字符串的长度
        let len = this.ByteToUint16(buf, index);

        var str = "",
            _arr: any = buf;
        let start = index + 2;
        let end = index + 2 + len;
        for (var i = start; i < end; i++) {
            if (i >= _arr.length) break; // todo这里会越界

            var one = _arr[i].toString(2),
                v = one.match(/^1+?(?=0)/);
            if (v && one.length == 8) {
                var bytesLength = v[0].length;
                var store = _arr[i].toString(2).slice(7 - bytesLength);
                for (var st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return [str, len + 2]; //这里的4是字符串的长度，也编码进去了,固定4个字节
    }
    export function ByteToint32(buf: never[], index: number) {
        let value = 0;
        if (Endian.instance.bigEndian) {
            value = ((buf[index] & 0xff) << 24) | ((buf[index + 1] & 0xff) << 16) | ((buf[index + 2] & 0xff) << 8) | (buf[index + 3] & 0xff);
        } else {
            value = (buf[index] & 0xff) | ((buf[index + 1] & 0xff) << 8) | ((buf[index + 2] & 0xff) << 16) | ((buf[index + 3] & 0xff) << 24);
        }
        return value;
    }

    export function ByteTouInt32(this: any, buf: any, index: number) {
        let value = this.ByteToint32(buf, index);
        if (value > 2147483647 || value < 0) {
            return value + 4294967296;
        }
        return value;
    }

    //解析负数
    export function ByteTouInt32_minus(buf: { [x: string]: number; }, index: number) {
        //此函数不对外，专门去掉是最高位的符号位
        let value = 0;
        if (Endian.instance.bigEndian) {
            value = ((~buf[index] & 0xff) << 24) | ((~buf[index + 1] & 0xff) << 16) | ((~buf[index + 2] & 0xff) << 8) | (~buf[index + 3] & 0xff);
        } else {
            value = (~buf[index] & 0xff) | ((~buf[index + 1] & 0xff) << 8) | ((~buf[index + 2] & 0xff) << 16) | ((~buf[index + 3] & 0xff) << 24);
        }

        if (value > 2147483647 || value < 0) {
            return value + 4294967296;
        }

        return value;
    }

    export function ByteToInt32_minus(buf: { [x: string]: number; }, index: number) {
        let value = 0;
        if (Endian.instance.bigEndian) {
            value = ((~buf[index] & 0xff) << 24) | ((~buf[index + 1] & 0xff) << 16) | ((~buf[index + 2] & 0xff) << 8) | (~buf[index + 3] & 0xff);
        } else {
            value = (~buf[index] & 0xff) | ((~buf[index + 1] & 0xff) << 8) | ((~buf[index + 2] & 0xff) << 16) | ((~buf[index + 3] & 0xff) << 24);
        }

        return value;
    }

    export function ByteToint64(this: any, buf: never[], index: number) {
        let h = 0;
        let l = 0;
        let flag = 1;
        if (Endian.instance.bigEndian) {
            if ((buf[index] & 0x80) > 0) {
                //最高位存的符号位
                //最高位>0，表示负数
                flag = -1;
                //高位采用int32来表示，
                //在js里面，最大整数只有2的53次方, 所以这里只支持-2的53次方--- 2的53次方
                h = this.ByteToInt32_minus(buf, index);
                //低位必须采用uint32来表示，因为低位不能带符号位
                l = this.ByteTouInt32_minus(buf, index + 4);
            } else {
                h = this.ByteToint32(buf, index);
                l = this.ByteTouInt32(buf, index + 4);
            }
        } else {
            if ((buf[index + 7] & 0x08) > 0) {
                //最高位存的符号位
                flag = -1;
                //高位采用int32来表示
                //在js里面，最大整数只有2的53次方, 所以这里只支持-2的53次方--- 2的53次方
                h = this.ByteToInt32_minus(buf, index + 4);
                //低位必须采用uint32来表示，因为低位不能带符号位
                l = this.ByteTouInt32_minus(buf, index);
            } else {
                h = this.ByteToint32(buf, index + 4);
                l = this.ByteTouInt32(buf, index);
            }
        }

        if (flag < 0) {
            return (this.getNumberFromHAndLBit(h, l) + 1) * -1;
        }
        return this.getNumberFromHAndLBit(h, l);
    }

    export function ByteToUint16(buf: never[], index: number) {
        let value = 0;
        if (Endian.instance.bigEndian) {
            value = ((buf[index] & 0xff) << 8) | (buf[index + 1] & 0xff);
        } else {
            value = (buf[index] & 0xff) | ((buf[index + 1] & 0xff) << 8);
        }
        return value;
    }

    export function ByteToint16(this: any, buf: any, index: any) {
        let value = this.ByteToUint16(buf, index);
        if (value > 32767) {
            value -= 65536;
        }

        return value;
    }

    export function ByteToint8(buf: { [x: string]: number; }, index: string | number) {
        let value = buf[index] & 0xff;
        if (value > 127) {
            value -= 256;
        }
        return value;
    }

    export function ByteTouInt8(buf: never[], index: number) {
        return buf[index] & 0xff;
    }

    //utf8字节数组转换Unicode字符串
    // export function utf8ByteToUnicodeStr(buf, index){
    //     //先解字符串的长度
    //     let len = this.ByteTouInt16(buf, index);
    //     let start = index + 2;
    //     let end = index + 2 + len;

    //     var unicodeStr ="";
    //     for (var pos = start; pos < end;){
    //         var flag= buf[pos];
    //         var unicode = 0 ;
    //         if ((flag >>>7) === 0 ) {
    //             unicodeStr+= String.fromCharCode(buf[pos]);
    //             pos += 1;

    //         } else if ((flag &0xFC) === 0xFC ){
    //             unicode = (buf[pos] & 0x3) << 30;
    //             unicode |= (buf[pos+1] & 0x3F) << 24;
    //             unicode |= (buf[pos+2] & 0x3F) << 18;
    //             unicode |= (buf[pos+3] & 0x3F) << 12;
    //             unicode |= (buf[pos+4] & 0x3F) << 6;
    //             unicode |= (buf[pos+5] & 0x3F);
    //             unicodeStr+= String.fromCodePoint(unicode) ;
    //             pos += 6;

    //         }else if ((flag &0xF8) === 0xF8 ){
    //             unicode = (buf[pos] & 0x7) << 24;
    //             unicode |= (buf[pos+1] & 0x3F) << 18;
    //             unicode |= (buf[pos+2] & 0x3F) << 12;
    //             unicode |= (buf[pos+3] & 0x3F) << 6;
    //             unicode |= (buf[pos+4] & 0x3F);
    //             unicodeStr+= String.fromCodePoint(unicode) ;
    //             pos += 5;

    //         } else if ((flag &0xF0) === 0xF0 ){
    //             unicode = (buf[pos] & 0xF) << 18;
    //             unicode |= (buf[pos+1] & 0x3F) << 12;
    //             unicode |= (buf[pos+2] & 0x3F) << 6;
    //             unicode |= (buf[pos+3] & 0x3F);
    //             unicodeStr+= String.fromCodePoint(unicode) ;
    //             pos += 4;

    //         } else if ((flag &0xE0) === 0xE0 ){
    //             unicode = (buf[pos] & 0x1F) << 12;;
    //             unicode |= (buf[pos+1] & 0x3F) << 6;
    //             unicode |= (buf[pos+2] & 0x3F);
    //             unicodeStr+= String.fromCharCode(unicode) ;
    //             pos += 3;

    //         } else if ((flag &0xC0) === 0xC0 ){ //110
    //             unicode = (buf[pos] & 0x3F) << 6;
    //             unicode |= (buf[pos+1] & 0x3F);
    //             unicodeStr+= String.fromCharCode(unicode) ;
    //             pos += 2;

    //         } else{
    //             unicodeStr+= String.fromCharCode(buf[pos]);
    //             pos += 1;
    //         }
    //     }
    //     return unicodeStr;
    // }

    //根据超过int32的数字，转成高32位，低32位，用十进制表示
    export function getHAndLBitFromNumber(this: any, num: number) {
        let h = 0;
        let l = 0;

        let hex_str = num.toString(16);
        let len = hex_str.length;
        if (num >= 0) {
            if (len > 8) {
                let l0 = hex_str.substring(len - 8, len);
                let h0 = hex_str.substring(0, len - 8);
                h = this.hex2int(h0);
                l = this.hex2int(l0);
            } else {
                l = num;
                h = 0;
            }
        } else {
            //符号位存在最高位
            if (len > 9) {
                let l0 = hex_str.substring(len - 8, len);
                let h0 = hex_str.substring(1, len - 8);
                h = this.hex2int(h0) | 0x80000000;
                l = this.hex2int(l0);
            } else {
                l = num * -1;
                h = 0x80000000;
            }
        }

        return [h, l];
    }

    //根据高低分别32位的十进制，还原成超过int32的数字
    export function getNumberFromHAndLBit(this: any, h: number, l: { toString: (arg0: number) => any; }) {
        let flag = 1;
        if (h < 0) {
            flag = -1;
            h = -h;
        }
        let h_str = h.toString(16);
        let l_str = l.toString(16);
        let len = l_str.length;
        if (len < 8) {
            for (let i = 0; i < 8 - len; i++) {
                l_str = "0" + l_str;
            }
        }

        return this.hex2int(h_str + l_str) * flag;
    }

    export function hex2int(hex: string) {
        var len = hex.length,
            a = new Array(len),
            code;
        for (var i = 0; i < len; i++) {
            code = hex.charCodeAt(i);
            if (48 <= code && code < 58) {
                code -= 48;
            } else {
                code = (code & 0xdf) - 65 + 10;
            }
            a[i] = code;
        }

        return a.reduce(function (acc, c) {
            acc = 16 * acc + c;
            return acc;
        }, 0);
    }
}
