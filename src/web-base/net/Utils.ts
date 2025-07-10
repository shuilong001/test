import { EncodeUtils } from './EncodeUtils'
import { NetMsgType } from '../netBase/NetMsgType';

import FingerprintJS from '@fingerprintjs/fingerprintjs'
import Bowser from 'bowser'
const getRandomNum = (start: number, end: number) => {

    return Math.floor(Math.round(Math.random() * (end - start) + start))


};

const base64Encode = (str: string) => {
    // 将字符串转换为 UTF-8 字节，然后使用原生的 btoa
    const utf8Bytes = new TextEncoder().encode(str);
    const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binaryString);
};

const base64Decode = (encodedStr: string) => {
    try {
        // 使用原生的 atob 解码
        const binaryString = atob(encodedStr);
        // 将二进制字符串转换为字节数组
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        // 使用 TextDecoder 将字节数组转换为 UTF-8 字符串
        return new TextDecoder().decode(bytes);
    } catch (error) {
        console.error('Base64 decode error:', error);
        return '';
    }
};

const getRandomSign = (deviceId: string) => {
    let random1 = getRandomNum(0, 9);
    let random2 = getRandomNum(0, 9);
    let baseStr =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let leng = baseStr.length;
    let str1 = '';
    for (let k = 0; k < random1; ++k) {
        let idx = getRandomNum(0, leng - 1);
        let tmp = baseStr[idx];
        str1 = str1 + tmp;
    }
    let str2 = '';
    for (let k = 0; k < random2; ++k) {
        let idx = getRandomNum(0, leng - 1);
        let tmp = baseStr[idx];
        str2 = str2 + tmp;
    }
    let str = random1.toString() + random2.toString() + str1 + deviceId + str2;
    let base64Str = btoa(str);

    return base64Str;
};

const md5 = (md5str: string) => {
    var createMD5String = function (string: string) {
        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22;
        var S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20;
        var S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23;
        var S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21;
        string = uTF8Encode(string);
        x = convertToWordArray(string);
        a = 0x67452301;
        b = 0xefcdab89;
        c = 0x98badcfe;
        d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
            b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
            a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
            c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
            c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
            a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
            a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
            a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
            a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
            c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
            c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
            b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
            c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
            d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
            c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
            a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
            d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
            b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
            a = addUnsigned(a, AA);
            b = addUnsigned(b, BB);
            c = addUnsigned(c, CC);
            d = addUnsigned(d, DD);
        }
        var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
        return tempValue.toLowerCase();
    };
    var rotateLeft = function (lValue: number, iShiftBits: number) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };
    var addUnsigned = function (lX: number, lY: number) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = lX & 0x80000000;
        lY8 = lY & 0x80000000;
        lX4 = lX & 0x40000000;
        lY4 = lY & 0x40000000;
        lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
        if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
            else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
        } else {
            return lResult ^ lX8 ^ lY8;
        }
    };
    var F = function (x: number, y: number, z: number) {
        return (x & y) | (~x & z);
    };
    var G = function (x: number, y: number, z: number) {
        return (x & z) | (y & ~z);
    };
    var H = function (x: number, y: number, z: number) {
        return x ^ y ^ z;
    };
    var I = function (x: number, y: number, z: number) {
        return y ^ (x | ~z);
    };
    var FF = function (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var GG = function (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var HH = function (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var II = function (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var convertToWordArray = function (string: string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWordsTempOne = lMessageLength + 8;
        var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
        var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition);
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };
    var wordToHex = function (lValue: number) {
        var WordToHexValue = "",
            WordToHexValueTemp = "",
            lByte,
            lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValueTemp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
        }
        return WordToHexValue;
    };
    var uTF8Encode = function (string: string) {
        string = string.toString().replace(/\x0d\x0a/g, "\x0a");
        var output = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                output += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128);
            } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128);
            }
        }
        return output;
    };
    return createMD5String(md5str);
}

function stime() {
    let tb = {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        getMsgID: function () {
            return NetMsgType.msgType["msg_stime"];
        },
        encode: function (buf: number[]) {
            EncodeUtils.int32ToByte(tb.year, buf);
            EncodeUtils.int32ToByte(tb.month, buf);
            EncodeUtils.int32ToByte(tb.day, buf);
            EncodeUtils.int32ToByte(tb.hour, buf);
            EncodeUtils.int32ToByte(tb.minute, buf);
            EncodeUtils.int32ToByte(tb.second, buf);
        },
        decode: function (buf: any, index: number) {
            let startIndex = index;
            tb.year = EncodeUtils.ByteToint32(buf, startIndex);
            startIndex += 4;
            tb.month = EncodeUtils.ByteToint32(buf, startIndex);
            startIndex += 4;
            tb.day = EncodeUtils.ByteToint32(buf, startIndex);
            startIndex += 4;
            tb.hour = EncodeUtils.ByteToint32(buf, startIndex);
            startIndex += 4;
            tb.minute = EncodeUtils.ByteToint32(buf, startIndex);
            startIndex += 4;
            tb.second = EncodeUtils.ByteToint32(buf, startIndex);
            startIndex += 4;
            return startIndex - index;
        },
        build: function (buf: number[]) {
            EncodeUtils.uInt16ToByte(NetMsgType.msgType["msg_stime"], buf);
            return tb.encode(buf);
        }
    };
    return tb;
}

const getDeviceId = async () => {
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    return result.visitorId
}


const aaa = getRandomNum(1, 10);
const bbb = md5("ZQnpBRGSWyI0CUdu" + aaa + "zT6FNt5/VfjhVfj");
const device_obj = Bowser.getParser(navigator.userAgent); 

const device_model = (device_obj.getPlatform().model||''+' '+device_obj.getOS().name||'' +' '+device_obj.getOS().version||'')||'--'
export {
    getRandomNum,
    base64Encode,
    base64Decode,
    getRandomSign,
    md5,
    stime,
    getDeviceId,
    aaa,
    bbb,
    device_model
}