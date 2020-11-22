function gather() {
    const selection = document.getSelection()
    if (!selection.rangeCount) {
        alert("Please select some text.")
        return
    }
    const range = selection.getRangeAt(0)
    const quoteSelector = anchoring.TextQuoteAnchor.fromRange(document.body, range)
    const exact = quoteSelector.exact
    const prefix = quoteSelector.prefix

    if (!exact) {
        alert("Please select some text.")
        return
    }

    const positionSelector = anchoring.TextPositionAnchor.fromRange(document.body, range)
    const start = positionSelector.start
    const end = positionSelector.end

    const titleElement = document.querySelector('head title')
    const title = titleElement ? titleElement.innerText : location.href

    const data = {
        uri: location.href,
        title: title,
        exact: exact,
        prefix: prefix,
        start: start,
        end: end,
    }
    const encodedData = encodeURIComponent(JSON.stringify(data));
    location.href = `${$_SITE_URL}/nanopubs/register?url=${encodeURIComponent(data.uri)}&title=${data.title}&data=${encodedData}`
}
var script = document.createElement('script');
script.src = `${$_SITE_URL}/assets/s/anchoring.js`;
script.onload = function () { setTimeout(gather, 0); }
document.head.appendChild(script);
