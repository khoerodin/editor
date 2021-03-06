class Utility {
  getFigureTypeByUrl (url) {
    var figure = false
    if (url.match(/^(https?):\/\/(www\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/i) || url.match(/^(https?):\/\/(www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/i)) {
      figure = "iframe"
    }

    if (url.match(/^(https?):\/\/(www\.)?vimeo\.com\/(\d+)/i)) {
      figure = "iframe"
    }

    if (url.match(/^(https?):\/\/(www\.|mobile\.)?twitter\.com\/(.+)\/status\/(\d+)/i)) {
      figure = "iframe"
    }

    if (url.match(/^data:(image\/gif|image\/jpe?g|image\/png);base64,(.*)$/) || url.match(/\.(jpe?g|png|gif)$/i)) {
      figure = "image"
    }

    return figure
  }

  isSelectionInsideElement (tagName) {
    var sel, containerNode
    tagName = tagName.toUpperCase()
    if (window.getSelection) {
      sel = window.getSelection()
      if (sel.rangeCount > 0) {
        containerNode = sel.getRangeAt(0).commonAncestorContainer
      }
    } else if ((sel = document.selection) && sel.type != "Control") {
      containerNode = sel.createRange().parentElement()
    }
    while (containerNode) {
      if (containerNode.nodeType == 1 && containerNode.tagName == tagName) {
        return true
      }
      containerNode = containerNode.parentNode
    }
    return false
  }

  removePlaceholder () {
    $('.embed-area').removeAttr('data-placeholder').removeClass('embed-area')
  }

  readUrl (url) {
    if (this.getFigureTypeByUrl(url)) {
      this.createFigure({ src: url })
      document.querySelector('.url-area').remove() // tempat paste url
      document.querySelector('.url-area').removeAttribute('class') // tempat kursor bawah figure
      return false;
    }

    return true
  }

  createFigure (embedData) {
    var range = quill.getSelection(true)
    quill.insertEmbed(range.index, 'figure', embedData, Quill.sources.USER)
    quill.setSelection(range.index + 2, Quill.sources.SILENT)
  }
}
var Utilities = new Utility()

var slicedToArray = function () {
  function t(t, e) {
    var o = [],
      l = !0,
      i = !1,
      r = void 0;
    try {
      for (var a, n = t[Symbol.iterator](); !(l = (a = n.next()).done) && (o.push(a.value), !e || o.length !== e); l = !0);
    } catch (s) {
      i = !0, r = s
    } finally {
      try {
        !l && n["return"] && n["return"]()
      } finally {
        if (i) throw r
      }
    }
    return o
  }
  return function (e, o) {
    if (Array.isArray(e)) return e
    if (Symbol.iterator in Object(e)) return t(e, o)
    throw new TypeError("Invalid attempt to destructure non-iterable instance")
  }
}()

function _resizeIframe(t, e, o) {
  $("iframe").map(function() {
      var l = null;
      try {
          l = this.contentWindow
      } catch (i) {}
      if (l && l == t) {
          var r = o / e;
          this.setAttribute("width", "680"),
          this.setAttribute("height", Math.round(680 * r) + ""),
          this.parentNode && this.parentNode.classList.contains("iframe-helper") && (this.parentNode.style.paddingTop = 100 * r + "%")
      }
  })
}

var Block = Quill.import('blots/block')
var BlockEmbed = Quill.import('blots/block/embed')
var Keyboard = Quill.import('modules/keyboard')
var Clipboard = Quill.import('modules/clipboard')
var Delta = Quill.import('delta')
var Icons = Quill.import('ui/icons');

class DividerBlot extends BlockEmbed { }
DividerBlot.blotName = 'divider'
DividerBlot.tagName = 'hr'
Quill.register(DividerBlot)

class FigureBlot extends BlockEmbed {
  static create(embedData) {
    let figure = super.create();
    figure.dataset.src = embedData.src
    figure.setAttribute('contenteditable', false)

    var figcaption = document.createElement('figcaption')
    figcaption.setAttribute('contenteditable', true)
    figcaption.setAttribute('data-placeholder', 'Judul (opsional)')
    figcaption.innerText = embedData.caption ? embedData.caption : ''

    var figureWrapper = document.createElement('div')
    figureWrapper.setAttribute('class', 'figure-wrapper')
    figure.appendChild(figureWrapper)

    var figureType = Utilities.getFigureTypeByUrl(embedData.src)
    this[figureType](figureWrapper, embedData.src)

    figure.appendChild(figcaption)
    return figure;
  }

  static iframe(figureWrapper, src) {
    var iframeWrapper = document.createElement('div')
    iframeWrapper.setAttribute('class', 'iframe-wrapper')

    var iframeHelper = document.createElement('div')
    iframeHelper.setAttribute('class', 'iframe-helper')
    iframeHelper.style.paddingTop = '56.25%'

    var iframe = document.createElement('iframe')
    iframe.setAttribute('src', this.embedUrl() + src)
    iframe.setAttribute('frameborder', 0)
    iframe.setAttribute('allowtransparency', true)
    iframe.setAttribute('allowfullscreen', true)
    iframe.setAttribute('scrolling', 'no')
    iframe.setAttribute("width", "680")
    iframe.setAttribute("height", "auto")

    figureWrapper.appendChild(iframeWrapper)
    iframeWrapper.appendChild(iframeHelper)
    iframeHelper.appendChild(iframe)
  }

  static image(figureWrapper, src) {
    var img = document.createElement('img')
    img.setAttribute('src', src)
    figureWrapper.appendChild(img)
  }

  static embedUrl() {
    return '/embed?url='
  }

  static value(figure) {
    return {
      src: figure.dataset.src,
      caption: figure.getElementsByTagName('figcaption')[0].innerText
    }
  }
}
FigureBlot.blotName = 'figure'
FigureBlot.tagName = 'figure'
Quill.register(FigureBlot)

class PlainClipboard extends Clipboard {
  convert(html = null) {
    if (typeof html === 'string') {
      this.container.innerHTML = html
    }
    let text = this.container.innerText
    this.container.innerHTML = ''
    return new Delta().insert(text)
  }
}
Quill.register('modules/clipboard', PlainClipboard, true)

// change icons
Icons['bold'] = '<i class="fas fa-bold fa-lg"></i>';
Icons['italic'] = '<i class="fas fa-italic fa-lg"></i>';
Icons['link'] = '<i class="fas fa-link fa-lg"></i>';
Icons['header']['1'] = '<i class="fas fa-heading fa-lg"></i>';
Icons['header']['2'] = '<i class="fas fa-heading"></i>';
Icons['blockquote'] = '<i class="fas fa-quote-left fa-lg"></i>';

var quill = new Quill('#editor-container', {
  theme: 'bubble'
})

quill.addContainer($("#sidebar-controls").get(0))
quill.on(Quill.events.EDITOR_CHANGE, function (eventType, range) {
  Utilities.removePlaceholder()
  if (eventType !== Quill.events.SELECTION_CHANGE) return
  if (range == null) return
  if (range.length === 0) {
    var [block, offset] = quill.scroll.descendant(Block, range.index)
    if (block != null && block.domNode.firstChild instanceof HTMLBRElement && !Utilities.isSelectionInsideElement('li')) {
      var lineBounds = quill.getBounds(range)
      $('#sidebar-controls').show().css({
        left: lineBounds.left - 120,
        top: lineBounds.top - 2
      });
    } else {
      $('#sidebar-controls').fadeOut()
    }
  } else {
    $('#sidebar-controls').fadeOut()
  }

  // var delta = quill.getContents()
  // console.log('Delta:', JSON.stringify(delta.ops))
});

document.getElementById('divider-button').addEventListener('click', function () {
  var range = quill.getSelection(true)
  quill.insertEmbed(range.index, 'divider', true, Quill.sources.USER)
  quill.setSelection(range.index + 1, Quill.sources.SILENT)
  $('#sidebar-controls').fadeOut()
});

document.getElementById('embed-button').addEventListener('click', function () {
  var e = quill.getSelection(!0),
    o = quill.scroll.line(e.index),
    l = slicedToArray(o, 1),
    i = l[0];
  if (i) {
    var r = $(i.domNode).text()
    r || (i.domNode.setAttribute('data-placeholder', 'Tempelkan tautan YouTube dan tekan Enter'), $(i.domNode).addClass('embed-area url-area'), $('#sidebar-controls').fadeOut())
  }
});

var inputFile = document.createElement("input")
inputFile.setAttribute("type", "file")
inputFile.setAttribute("accept", "image/gif, image/jpeg, image/jpg, image/png")
inputFile.setAttribute("style", "display:none")

quill.container.appendChild(inputFile)

inputFile.addEventListener("change", function (e) {
  var reader = new FileReader()
  reader.onload = function() {
    var base64data = reader.result
    Utilities.createFigure({ src: base64data })
  }
  reader.readAsDataURL(e.target.files[0])
})

document.getElementById('image-button').addEventListener('click', function () {
  inputFile.click()
})

quill.keyboard.addBinding({ key: Keyboard.keys.ENTER }, function (t, e) {
  var o = quill.scroll.line(t.index),
    l = slicedToArray(o, 2),
    i = l[0],
    r = l[1];
  if (i) {
    var n = i.domNode.innerText,
      s = n.substr(0, r),
      u = void 0;
    if (u = s.match(/(^|\s)(https?:\/\/\S+)$/)) {
      return Utilities.readUrl(u[2])
    } else {
      return true
    }
  }
});

quill.keyboard.bindings[Keyboard.keys.ENTER].unshift(quill.keyboard.bindings[Keyboard.keys.ENTER].pop())

// set contents
var contents = [{ "insert": "Toshi Omagari’s updated version opens up the typeface - version opens up the typeface" }, { "attributes": { "header": 1 }, "insert": "\n" }, { "insert": "The decorative blackletter – " }, { "attributes": { "link": "#" }, "insert": "which offers a stark contrast with" }, { "insert": " the other four typefaces included in the Wolpe Collection – drew on Berthold Wolpe’s time working in a metal foundry. As a result, it adopts the kinds of angular forms that would have been more easily chiselled into metal – appearing slightly less intricate than fellow blackletter faces.\nAn early specimen sheet, published in 1938, said the typeface was intending to cause a stir among “horizon-scanning advertisers”, however the design quickly fell into obscurity, particularly as a result of blackletter’s connotations." }, { "attributes": { "blockquote": true }, "insert": "\n" }, { "insert": "An early specimen sheet" }, { "attributes": { "header": 2 }, "insert": "\n" }, { "insert": "List Pertama" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "List Kedua" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "List Ketiga" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "List Keempat" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "List Kelima" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "An early specimen sheet" }, { "attributes": { "header": 2 }, "insert": "\n" }, { "insert": "List Pertama" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "List Kedua" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "List Ketiga" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "List Keempat" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "List Kelima" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "There were reportedly only two sets of matrices ever made of Sachsenwald, which otherwise has lived on only through original drawings held by the Monotype archive. \n" }, { "insert": { "divider": true } }, { "insert": "As you’d expect, examples of it being used are limited, however it can be seen in a rare edition of the Rubaiyat of Omar Khayyam, published by Fanfare Press in the 1940s.\n" }, {"insert": {"figure": {"src": "https://www.youtube.com/watch?v=Dvgu3Czyjmk", "caption": "Ini Judul Video"} } }, { "insert": "Toshi Omagari’s updated version opens up the typeface for experimentation by today’s designers, and also introduces elements that make it easier for today’s purposes – including a romanized version of the distinctive traditional German X originally used in Sachsenwald.\nGet the Sachsenwald typeface" }, { "attributes": { "header": 2 }, "insert": "\n" }, { "insert": "View the web specimen for Sachsenwald and The Wolpe Collection. All five families are included in Monotype Library Subscription. Get unlimited access to over 10,000 fonts for $9.99/month. Try it now for free.\nHeading 1" }, { "attributes": { "header": 1 }, "insert": "\n" }, { "insert": "Heading 2" }, { "attributes": { "header": 2 }, "insert": "\n" }, { "insert": "Heading 3" }, { "attributes": { "header": 3 }, "insert": "\n" }, { "insert": "Heading 4" }, { "attributes": { "header": 4 }, "insert": "\n" }, { "insert": "Heading 5" }, { "attributes": { "header": 5 }, "insert": "\n" }, { "insert": "Heading 6" }, { "attributes": { "header": 6 }, "insert": "\n" }]
// var contents = [{ "insert": "Lalalalalalal" }, { "insert": { "figure": { "type": "video", "src": "https://vimeo.com/195304295", "caption": "Ini Judul/Caption Video" } } }]
// var contents = [{ "insert": "Lalalalalalal" }, { "insert": { "figure": { "type": "rich", "src": "https://twitter.com/CGV_ID/status/924530299735752705", "caption": "Ini Judul/Caption Video" } } }]
// var contents = [{ "insert": "Lalalalalalal" }, { "insert": { "figure": { "type": "rich", "src": "https://gist.github.com/khoerodin/fb7ab7d7c892243622c6b8dc6f9ad5dc", "caption": "Ini Judul/Caption Video" } } }]
// var contents = [{ "insert": "Lalalalalalal" }, { "insert": { "figure": { "type": "rich", "src": "https://www.facebook.com/mamaeh.edy/posts/2050682998513142", "caption": "Ini Judul/Caption Video" } } }]
console.log(quill.getContents(quill.setContents(contents)))
