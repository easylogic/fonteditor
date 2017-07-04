
define(
    function (require) {

		

        describe('INDEX type', function () {

			it('test INDEX encoding', function () {
				
				var indexObject = new INDEX([
					{ name : 'foo', type : 'string', value: 'hello'},
					{ name : 'bar', type : 'number', value: 23 }
				]);

				expect(hex(indexObject.encode())).toBe('00 02 01 01 06 07 68 65 6C 6C 6F A2');	// 1 바이트 배열로 리턴 
				expect(indexObject.sizeof()).toBe(12);	// 1 바이트 배열로 리턴 
					
			});

        });

    }
);
