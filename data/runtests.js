const RUN_TESTS_DELAY = 500;

let runTestsTimeout = null;

window.setTimeout(initializeKeyEventHandler, 1000);

function initializeKeyEventHandler() {
  let iframe = document.querySelector("iframe.cke_wysiwyg_frame");
  iframe.contentWindow.addEventListener("keyup", runTestsAfterTimeout);
  iframe.contentWindow.addEventListener("keydown", resetRunTestsTimeout);
  
  function runTestsAfterTimeout() {
    runTestsTimeout = window.setTimeout(runTests, RUN_TESTS_DELAY);
  }
  
  function resetRunTestsTimeout() {
    window.clearTimeout(runTestsTimeout);
  }
  
  let ckeditor = document.getElementById("id_content");
  ckeditor.addEventListener("keyup", runTestsAfterTimeout);
  ckeditor.addEventListener("keydown", resetRunTestsTimeout);
}

function runTest(testObj, id, rootElement) {
  // Only run the test suite if there's a root element
  //(e.g. when in source view there's no root element set)
  if (rootElement) {
    let contentTest = testObj.check(rootElement);
    testObj.errors = contentTest;
    self.port.emit("processTestResult", testObj, id);
  }
};

function runTests() {
  let iframe = document.querySelector("iframe.cke_wysiwyg_frame");
  if (iframe) {
    let rootElement = iframe.contentDocument.body;
    for (let prop in docTests) {
      runTest(docTests[prop], prop, rootElement);
    }
  }
  self.port.emit("finishedTests");
}

self.port.on("runTests", function() {
  runTests();
});

let btns = document.querySelectorAll(".btn-save, .btn-save-and-edit");
let comment = document.querySelector("#page-comment #id_comment");

let disableBtns = function(bool) {
  for (let i = 0; i < btns.length; i++) {
    btns[i].disabled = bool;
  }
};

if (comment) {
  if (comment.value === '') {
    disableBtns(true);
  }

  comment.addEventListener("change", function() {
    disableBtns(false);
  });
}

window.addEventListener("load", function injectIFrame() {
  window.removeEventListener("load", injectIFrame);

  // Using a timeout to add the spellchecking, because the iframe is not loaded immediately and
  // there doesn't seem to be a proper event to react to.
  setTimeout(() => {
    let iframe = document.querySelector("iframe.cke_wysiwyg_frame");
    if (iframe) {
      iframe.contentDocument.body.setAttribute("spellcheck", "true");
    }
  }, 1000);
});
