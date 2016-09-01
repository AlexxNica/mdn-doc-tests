const reMacrosNotRequiringParams = /\{\{\s*(?:JSRef|csssyntax|cssinfo|svginfo)\([^\)]+?\)\s*\}\}/i;
const reMacrosNotRequiringParamsGlobal = new RegExp(reMacrosNotRequiringParams.source, "gi");

docTests.unnecessaryMacroParams = {
  name: "unnecessary_macro_params",
  desc: "unnecessary_macro_params_desc",
  check: function checkUnnecessaryMacroParams(rootElement) {
    let treeWalker = document.createTreeWalker(
        rootElement,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            return node.textContent.match(reMacrosNotRequiringParams) ?
                NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          }
        }
    );
    let matches = [];

    while(treeWalker.nextNode()) {
      let textNodeMatches = treeWalker.currentNode.textContent.match(
          reMacrosNotRequiringParamsGlobal) || [];
      textNodeMatches.forEach(match => {
        let paramMatch = match.match(/(?:csssyntax|cssinfo|svginfo)\((["'])(.+?)\1/i);
        if (paramMatch) {
          let param = paramMatch[2];
          if (param === document.title.replace(/^(.+?) \| Edit.*$/, "$1")) {
            matches.push({
              msg: "macro_with_unnecessary_params_equalling_slug",
              msgParams: [match],
              type: ERROR
            });
          }
        } else {
          matches.push({
            msg: "macro_with_unused_params",
            msgParams: [match],
            type: ERROR
          });
        }
      });
    }

    return matches;
  }
};