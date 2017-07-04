/**
 * @file cff表
 * @author mengke01(kekee000@gmail.com)
 *
 * reference:
 * http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/font/pdfs/5176.CFF.pdf
 *
 * modify from:
 * https://github.com/nodebox/opentype.js/blob/master/src/tables/cff.js
 */

define(
    function (require) {


        /**
         * 获取cff偏移
         * @param  {Reader} reader  读取器
         * @param  {number} offSize 偏移大小
         * @param  {number} offset  起始偏移
         * @return {number}         偏移
         */
        function getOffset(reader, offSize) {
            var v = 0;
            for (var i = 0; i < offSize; i++) {
                v <<= 8;
                v += reader.readUint8();
            }
            return v;
        }

        /**
         * 解析`CFF`表索引
         * @param  {Reader} reader       读取器
         * @param  {number} offset       偏移
         * @param  {Funciton} conversionFn 转换函数
         * @return {Object}              表对象
         */
        function parseCFFIndex(reader, offset, conversionFn) {
            if (offset) {
                reader.seek(offset);
            }
            var start = reader.offset;
            var offsets = [];
            var objects = [];
            var count = reader.readUint16();
            var i;
            var l;

            if (count !== 0) {
                var offsetSize = reader.readUint8();
                for (i = 0, l = count + 1; i < l; i++) {
                    offsets.push(getOffset(reader, offsetSize));
                }

                for (i = 0, l = count; i < l; i++) {
                    var value = reader.readBytes(offsets[i + 1] - offsets[i]);
                    if (conversionFn) {
                        value = conversionFn(value);
                    }
                    objects.push(value);
                }
            }

            return {
                objects: objects,
                startOffset: start,
                endOffset: reader.offset
            };
        }

       
        return parseCFFIndex;
    }
);
