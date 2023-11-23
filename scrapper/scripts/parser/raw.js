() => {
  try {
    function updateLinks() {
      let restrictedHrefs = ["", "/", "#", "javascript:void(0)", "javascript:;"];

      // Get all anchor elements
      var links = document.querySelectorAll('a');

      // Get the base URL of the current page
      var baseURL = window.location.origin;

      // Iterate through each anchor element
      links.forEach(function (link) {
        // Get the href attribute
        var href = link.getAttribute('href');

        // Check if the href is a relative path
        if (href && !href.startsWith('http') && !href.startsWith('//') && !restrictedHrefs.includes(href)) {
          // Construct the full URL by appending the relative path to the base URL
          var fullURL = baseURL + href;

          // Update the href attribute
          link.setAttribute('href', fullURL);
        }
      });
    }

    let result = document.body.innerText;

    // keep only target selector if specified
    let targetSelector = "%(targetSelector)s";
    if (targetSelector !== "") {
      updateLinks();
      let targetElement = document.querySelector(targetSelector);
      if (targetElement === null) {
        return {err: ["Provided target selector has not found on the page: " + targetSelector]};
      }
      result = targetElement.innerHTML;
    }
    return result;
  } catch (err) {
    return {err: ["Couldn't read the document: " + err.toString()]};
  }
}
