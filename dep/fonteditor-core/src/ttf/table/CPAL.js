/**
 * @file headøú
 * @author easylogic(cyberuls@gmail.com)
 */


define(
    function (require) {
        var table = require('./table');
        var struct = require('./struct');

        function parseCPALHead(reader) {
            var head = {};
            head.startOffset = reader.offset;
            head.endOffset = head.startOffset + 14;

            head.version = reader.readUint16();
            head.numPalettesEntries = reader.readUint16();
            head.numPalette = reader.readUint16();
            head.numColorRecords = reader.readUint16();
            head.offsetFirstColorRecord = reader.readUint32();
			head.colorRecordIndices = reader.readUint16();

			if (head.version == 1)
			{
				head.offsetPaletteTypeArray = reader.readUint32();
				head.offsetPaletteLabelArray = reader.readUint32();
				head.offsetPaletteEntryLabelArray = reader.readUint32();

				head.endOffset += 12; 
			}

            return head;
        }

		function dec2hex (num) {
			return ('0' + (num).toString('16')).substr(-2);
		}

        function parseCPALColorRecords(reader, offset, count) {
			if (offset)
			{
				reader.seek(offset);
			}

			var startOffset = offset;
			var endOffset = startOffset;

			var records = [];

			for(var i = 0; i < count; i++) {
				var r = reader.readUint8();
				var g = reader.readUint8();
				var b = reader.readUint8();
				var a = reader.readUint8();

				records.push({
					r : r, 
					g : g, 
					b : b, 
					a : a,
					hex : '#' + dec2hex(r) + dec2hex(g) + dec2hex(b) + dec2hex(a)
				})
			}

			endOffset += count * 4; 
		
			return { records : records, startOffset : startOffset, endOffset : endOffset };
		}


        function parseCPALTypeArray(reader, offset, count) {
			if (offset)
			{
				reader.seek(offset);
			}

			var startOffset = offset;
			var endOffset = startOffset;

			var paletteTypes = [];

			for(var i = 0; i < count; i++) {
				var paletteType = reader.readUint32();
				paletteTypes.push(paletteType);
			}

			endOffset += count * 4; 
		
			return { paletteTypes : paletteTypes, startOffset : startOffset, endOffset : endOffset };
		}

        function parseCPALLabelArray(reader, offset, count) {
			if (offset)
			{
				reader.seek(offset);
			}

			var startOffset = offset;
			var endOffset = startOffset;

			var paletteLabels = [];

			for(var i = 0; i < count; i++) {
				var label = reader.readUint16();
				paletteLabels.push(label);
			}

			endOffset += count * 2; 
		
			return { paletteLabels : paletteLabels, startOffset : startOffset, endOffset : endOffset };
		}

        function parseCPALEntryLabel(reader, offset, count) {
			if (offset)
			{
				reader.seek(offset);
			}

			var startOffset = offset;
			var endOffset = startOffset;

			var paletteEntryLabels = [];

			for(var i = 0; i < count; i++) {
				var label = reader.readUint16();
				paletteEntryLabels.push(label);
			}

			endOffset += count * 2; 
		
			return { paletteEntryLabels  : paletteEntryLabels , startOffset : startOffset, endOffset : endOffset };
		}


        var CPAL = table.create(
            'CPAL',
            [ ],
			{
				read : function (reader, ttf) {
					var offset = this.offset;
                    reader.seek(offset);

                    var head = parseCPALHead(reader);


					var colorRecords = parseCPALColorRecords(reader, head.endOffset, head.numColorRecords);

					head.colorRecords = colorRecords.records;

					if (head.version == 1)
					{
						if (head.offsetPaletteTypeArray > 0)
						{
							var typeArray = parseCPALTypeArray(reader, head.startOffset + head.offsetPaletteTypeArray, head.numPalette);

							head.paletteType  = typeArray.paletteTypes;
						}

						if (head.offsetPaletteLabelArray > 0)
						{
							var labelArray = parseCPALLabelArray(reader, head.startOffset + head.offsetPaletteLabelArray, head.numPalette);
							head.paletteLabel  = labelArray.paletteLabels;
						}

						if (head.offsetPaletteEntryLabelArray > 0)
						{
							var entryLabel = parseCPALEntryLabel(reader, head.startOffset + head.offsetPaletteEntryLabelArray, head.numPalettesEntries);

							head.paletteEntryLabel = entryLabel.paletteEntryLabels;
						}

					}

					
					delete head.startOffset;
					delete head.endOffset; 

					return head;

				},

				write : function (writer, ttf) {

					if (!ttf.CPAL)
					{
						return writer; 
					}

					ttf.CPAL.offsetFirstColorRecord = 14; 
					
					if (ttf.CPAL.version == 1)
					{
						ttf.CPAL.offsetFirstColorRecord += 12; 
					}

					ttf.CPAL.numColorRecords = ttf.CPAL.colorRecords.length; 

					// write head 
					writer.writeUint16(ttf.CPAL.version);
					writer.writeUint16(ttf.CPAL.numPalettesEntries);
					writer.writeUint16(ttf.CPAL.numPalette);
					writer.writeUint16(ttf.CPAL.numColorRecords);
					writer.writeUint32(ttf.CPAL.offsetFirstColorRecord);
					writer.writeUint16(ttf.CPAL.colorRecordIndices);

					if (ttf.CPAL.version == 1)
					{

						ttf.CPAL.offsetPaletteTypeArray =  14 + 12 + ttf.CPAL.numColorRecords * 4;
						ttf.CPAL.offsetPaletteLabelArray = ttf.CPAL.offsetPaletteTypeArray + ((ttf.CPAL.paletteType || []).length * 4);
						ttf.CPAL.offsetPaletteEntryLabelArray = ttf.CPAL.offsetPaletteLabelArray + ((ttf.CPAL.paletteLabel || []).length * 2);

						writer.writeUint32(ttf.CPAL.offsetPaletteTypeArray);
						writer.writeUint32(ttf.CPAL.offsetPaletteLabelArray);
						writer.writeUint32(ttf.CPAL.offsetPaletteEntryLabelArray);
					}

					// write color record 
					for(var i = 0; i < ttf.CPAL.numColorRecords; i++) {
						var color = ttf.CPAL.colorRecords[i];

						writer.writerUint8(color.r);
						writer.writerUint8(color.g);
						writer.writerUint8(color.b);
						writer.writerUint8(color.a);
					}

					if (ttf.CPAL.version == 1)
					{

						if (ttf.CPAL.paletteType && ttf.CPAL.paletteType.length)
						{
							for(var i = 0, len = ttf.CPAL.paletteType.length; i < len; i++) {
								writer.writeUint32(ttf.CPAL.paletteType[i]);
							}
						}

						if (ttf.CPAL.paletteLabel && ttf.CPAL.paletteLabel.length)
						{
							for(var i = 0, len = ttf.CPAL.paletteLabel.length; i < len; i++) {
								writer.writeUint16(ttf.CPAL.paletteLabel[i]);
							}
						}

						if (ttf.CPAL.paletteEntryLabel && ttf.CPAL.paletteEntryLabel.length)
						{
							for(var i = 0, len = ttf.CPAL.paletteEntryLabel.length; i < len; i++) {
								writer.writeUint16(ttf.CPAL.paletteEntryLabel[i]);
							}
						}
					}

					return writer; 
				},

				size : function (ttf) {

					if (!ttf.CPAL)
					{
						return 0;
					}

					var num = 0;

					// head size 

					num += 14;

					if (ttf.CPAL.version == 1)
					{
						num += 12; 
					}

					// color records 
					num += ttf.CPAL.colorRecords.length * 4; 

					if (ttf.CPAL.version == 1)
					{
						num += (ttf.CPAL.paletteType || []).length * 4;
						num += (ttf.CPAL.paletteLabel || []).length * 2;
						num += (ttf.CPAL.paletteEntryLabel || []).length * 2;
					}

					return num; 
				}
			}
        );

        return CPAL;
    }
);
