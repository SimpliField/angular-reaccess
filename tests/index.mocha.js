describe('sfReaccess', function () {
    var assert = chai.assert;

    beforeEach(module('simplifield.reaccess'));

    it('should contain a sfReaccessService service', inject(function(
        sfReaccessService
    ){
        assert(sfReaccessService);
    }));
});
