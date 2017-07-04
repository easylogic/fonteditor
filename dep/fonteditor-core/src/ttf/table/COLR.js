/**
 * @file head表
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var table = require('./table');
        var struct = require('./struct');

        function parseCOLRHead(reader) {
            var head = {};
            head.startOffset = reader.offset;
            head.endOffset = head.startOffset + 14;
            head.version = reader.readUint16();
            head.numBaseGlyphRecords = reader.readUint16();
            head.offsetBaseGlyphRecord = reader.readUint32();
            head.offsetLayerRecord = reader.readUint32();
            head.numLayerRecords = reader.readUint16();
            return head;
        }

		function parseCOLRGlyfRecords(reader, offset, count) {
			if (offset)
			{
				reader.seek(offset);
			}
			var records = [];
			var startOffset = offset;
			var endOffset = offset;
			for(var i = 0; i < count; i++) {
				var r = {};
				r.glyphId = reader.readUint16();			// 기본 글자 glyph id 
				r.firstLayerIndex = reader.readUint16();	// layer 로 사용할 첫번째 glyph index ,  layerRecords  의  index  
				r.numLayers = reader.readUint16();			// layer  로 사용할  glyph  개수 
				records.push(r);
				endOffset += 6;
			}

			return { records : records, startOffset : startOffset, endOffset : endOffset }; 
		}

		function parseCOLRLayerRecords(reader, offset, count) {
			if (offset)
			{
				reader.seek(offset);
			}
			var records = [];
			var startOffset = offset;
			var endOffset = offset;
			for(var i = 0; i < count; i++) {
				var r = {};
				r.glyphId = reader.readUint16();			// layer  로 사용할  glyph id  
				r.paletteIndex = reader.readUint16();		// layer  로 사용할  glyph color 
				records.push(r);
				endOffset += 4;
			}

			return { records : records, startOffset : startOffset, endOffset : endOffset }; 
		}

        var COLR = table.create(
            'COLR',
            [ ],
			{
				read : function (reader, ttf) {
					var offset = this.offset;
                    reader.seek(offset);

                    var head = parseCOLRHead(reader);

					var records = parseCOLRGlyfRecords (reader, head.startOffset + head.offsetBaseGlyphRecord, head.numBaseGlyphRecords);

					var layerRecords = parseCOLRLayerRecords (reader, head.startOffset + head.offsetLayerRecord, head.numLayerRecords);
					
					head.baseGlyphRecord = records.records; 
					head.layerRecord = layerRecords.records; 

					delete head.startOffset;
					delete head.endOffset; 

					return head; 
				},

				write : function (writer, ttf) {
					
					if (!ttf.COLR)
					{
						return writer; 
					}
					ttf.COLR.numBaseGlyphRecords = ttf.COLR.baseGlyphRecord.length;
					ttf.COLR.numLayerRecords = ttf.COLR.layerRecord.length;

					ttf.COLR.offsetBaseGlyphRecord = 10; 
					ttf.COLR.offsetLayerRecord = ttf.COLR.offsetBaseGlyphRecord + ttf.COLR.numLayerRecords * 6; 

					// write head 
					writer.writeUint16(ttf.COLR.version);
					writer.writeUint16(ttf.COLR.numBaseGlyphRecords);
					writer.writeUint32(ttf.COLR.offsetBaseGlyphRecord);
					writer.writeUint32(ttf.COLR.offsetLayerRecord);
					writer.writeUint16(ttf.COLR.numLayerRecords);

					// write glyfrecords 
					for(var i = 0; i < ttf.COLR.numBaseGlyphRecords; i++) {
						var r = ttf.COLR.baseGlyphRecord[i];

						if (ttf.glyf[r.glyphId])
						{
							r.numLayers = (ttf.glyf[r.glyphId].contours || []).length;
						}

						writer.writeUint16(r.glyphId);
						writer.writeUint16(r.firstLayerIndex);
						writer.writeUint16(r.numLayers);
					}

					// write layer records
					for(var i = 0; i < ttf.COLR.numLayerRecords; i++) {
						var r = ttf.COLR.layerRecord[i];

						writer.writeUint16(r.glyphId);
						writer.writeUint16(r.paletteIndex);
					}
					

                    return writer;
				},

				size : function (ttf) {

					if (!ttf.COLR)
					{
						return 0;
					}

					var num = 0;


					// head size 
					num += 10; 
	
					// glyph records size 
					num += 6 * ttf.COLR.baseGlyphRecord.length;

					// layer records size 
					num += 4 * ttf.COLR.layerRecord.length;

					return num; 
				}
			}
        );

        return COLR;
    }
);
