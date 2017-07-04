/**
 * @file 解析cff编码
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

		function parseCFFFDSelect(reader, start, font, fdArrayCount) {
			var fdSelect = [];
			var fdIndex;

			var nGlyphs = font.topDict.cidCount;

			var format = reader.readUint8();
			font.topDict.fdSelectFormat = format; 
			console.log(format);
			if (format === 0) {
				// Simple list of nGlyphs elements
				for (var iGid = 0; iGid < nGlyphs; iGid++) {
					fdIndex = reader.readUint8();
					if (fdIndex >= fdArrayCount) {
						throw new Error('CFF table CID Font FDSelect has bad FD index value ' + fdIndex + ' (FD count ' + fdArrayCount + ')');
					}
					fdSelect.push(fdIndex);
				}
			} else if (format === 3) {
				// Ranges
				var nRanges = reader.readUint16();
				var first = reader.readUint16();
				if (first !== 0) {
					throw new Error('CFF Table CID Font FDSelect format 3 range has bad initial GID ' + first);
				}
				var next;
				for (var iRange = 0; iRange < nRanges; iRange++) {
					fdIndex = reader.readUint8();
					next = reader.readUint16();
					if (fdIndex >= fdArrayCount) {
						throw new Error('CFF table CID Font FDSelect has bad FD index value ' + fdIndex + ' (FD count ' + fdArrayCount + ')');
					}
					if (next > nGlyphs) {
						throw new Error('CFF Table CID Font FDSelect format 3 range has bad GID ' + next);
					}
					for (; first < next; first++) {
						fdSelect.push(fdIndex);
					}
					first = next;
				}
				if (next !== nGlyphs) {
					throw new Error('CFF Table CID Font FDSelect format 3 range has bad final GID ' + next);
				}
			} else {
				throw new Error('CFF Table CID Font FDSelect table has unsupported format ' + format);
			}
			return fdSelect;
		}

		return parseCFFFDSelect;
    }
);
