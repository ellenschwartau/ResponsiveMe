'use strict';
console.log("test");
describe("Test", function() {
    console.log("describe");
    it("true", function() {
        console.log("it");
        expect(true).toBe(true);
    });
});
console.log("ende");
