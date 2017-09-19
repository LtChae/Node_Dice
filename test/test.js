var assert = require('assert');
describe('Bitwise Test', function() {
  it('should do a bitwise check on a thing', function() {
    var bit = 0x00002000 | 0x00000008;
    assert.equal(8200, bit);
  });

  it('should be able to extract a permission from a number', function() {
    var result = 0x00002000 & 8200;
    assert.equal(0x00002000, result);
  });

  it('should be able to extract a different permission from a number', function() {
    var result = 0x00000008 & 8200;
    assert.equal(0x00000008, result);
  });

  it('should be able to extract whether we can access external emojis from a number', function() {
    var result = 0x00040000 & 338952;
    assert.equal(0x00040000, result);
  });
});