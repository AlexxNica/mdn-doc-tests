const {ERROR, WARNING, url, runTests} = require("./testutils");

exports["test doc invalidMacros"] = function testInvalidMacros(assert, done) {
  const tests = [
    {
      str: '{{apiref}}' +
           '{{bug(123456)}}' +
           '{{previous("some page"}}' +
           '{{cssinfo(\'font-weight\', \'@font\')}}' +
           '{{invalidmacroname}}' +
           '{{invalidmacroname(123456)}}' +
           '{{invalidmacroname("some page")}}' +
           '{{invalidmacroname(\'font-weight\', \'@font\')}}',
      expected: [
        {
          msg: '{{invalidmacroname}}',
          type: WARNING
        },
        {
          msg: '{{invalidmacroname(123456)}}',
          type: WARNING
        },
        {
          msg: '{{invalidmacroname("some page")}}',
          type: WARNING
        },
        {
          msg: '{{invalidmacroname(\'font-weight\', \'@font\')}}',
          type: WARNING
        }
      ]
    }
  ];

  runTests(assert, done, "invalidMacros", "invalid macros", url, tests);
};

require("sdk/test").run(exports);