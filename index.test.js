/* eslint-env mocha */
'use strict';

const proclaim = require('proclaim');
const diskSpace = require('.');

describe('diskSpace', function () {

	it('it is a function', async () => {
		proclaim.isFunction(diskSpace);
	});

  it('it does not throw an error', function(done) {
      diskSpace('/' , function(error, data) {
        if (error) {
          done(error);
        } else {
          proclaim.isObject(data);
          proclaim.isNumber(data.usedSize);
          proclaim.isNumber(data.totalSize);
          done();
        }
      });
  });
});
