/**
 * @file headøú
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var table = require('./table');
        var struct = require('./struct');
		var string = require('../util/string');

        function parseSVGHead(reader) {
            var head = {};
            head.startOffset = reader.offset;
            head.endOffset = head.startOffset + 10;
            head.version = reader.readUint16();
            head.offsetToSVGDocIndex = reader.readUint32();
            head.reserved = reader.readUint32();
            return head;
        }

		function parseSVGDocumentIndex(reader, offset) {
			if (offset)
			{
				reader.seek(offset);
			}

			var startOffset = offset;
			var endOffset = startOffset;
			var index = {}

			index.numEntries = reader.readUint16();
			endOffset += 2; 

			index.entries = [];

			for(var i = 0; i < index.numEntries; i++) {
				var entry = {
					startGlyphID : reader.readUint16(),
					endGlyphID : reader.readUint16(),
					svgDocOffset: reader.readUint32(),
					svgDocLength: reader.readUint32()
				};

				index.entries.push(entry);
				endOffset += 12; 
			}

			// load svg document 
			for(var i = 0, len = index.entries.length; i < len;  i++) {
				var e = index.entries[i];
				e.svgDoc = reader.readString(startOffset + e.svgDocOffset, e.svgDocLength);
			}

			return { numEntries : index.numEntries, entries : index.entries, startOffset : startOffset, endOffset : endOffset }; 
		}

        var SVG = table.create(
            'SVG',
            [ ],
			{
				read : function (reader, ttf) {
					var offset = this.offset;
                    reader.seek(offset);

                    var head = parseSVGHead(reader);

					var records = parseSVGDocumentIndex (reader, head.startOffset + head.offsetToSVGDocIndex);

					head.entries = records.entries;
					head.numEntries = records.numEntries;

					delete head.startOffset;
					delete head.endOffset; 

					return head; 
				},

				write : function (writer, ttf) {

					if (!ttf.SVG)
					{
						return writer; 
					}

					ttf.SVG.offsetToSVGDocIndex = 10;

					writer.writeUint16(ttf.SVG.version);
					writer.writeUint32(ttf.SVG.offsetToSVGDocIndex);
					writer.writeUint32(ttf.SVG.reserved || 0);


					ttf.SVG.numEntries = ttf.SVG.entries.length; 
					writer.writeUint16(ttf.SVG.numEntries);

					var svgStartOffset = ttf.SVG.offsetToSVGDocIndex + 2 + ttf.SVG.numEntries * 12; 
					var svgDocList = [];

					for(var i = 0; i < ttf.SVG.numEntries; i++ ) {
						var e = ttf.SVG.entries[i];

						var bytes = string.toUTF8Bytes(e.svgDoc); 

						writer.writeUint16(e.startGlyphID);
						writer.writeUint16(e.endGlyphID);

						e.svgDocOffset = svgStartOffset;
						e.svgDocLength = bytes.length; 

						writer.writeUint32(e.svgDocOffset);
						writer.writeUint32(e.svgDocLength);

						svgDocList[i] = { bytes : bytes, offset : svgStartOffset }; 

						svgStartOffset += bytes.length; 
					}

					for(var i = 0, len = svgDocList.length; i < len; i++) {
						var doc = svgDocList[i];
						writer.writeBytes(doc.bytes, doc.bytes.length, doc.offset);
					}


					return writer; 
				},

				size : function (ttf) {

					if (!ttf.SVG)
					{
						return 0;
					}

					var num = 0;
	
					// head size 
					num += 10; 
					
					// entries 
					num += 2; 

					num += ttf.SVG.entries.length * 12;

					// svg list document size 
					for(var i = 0, len = ttf.SVG.entries.length; i < len; i++) {
						var e = ttf.SVG.entries[i];
						num += e.svgDocLength; 
					}


					return num; 
				}
			}
        );

        return SVG;
    }
);
