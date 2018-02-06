var isSelectionInsideElement = function (tagName) {
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
},

  slicedToArray = function () {
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
  }(),

  removePlaceholder = function () {
    $('.embed-area').removeAttr('data-placeholder').removeClass('embed-area')
  },

  makeEmbedVideoCode = function (embedData) {
    var range = quill.getSelection(true)
    quill.insertEmbed(range.index, 'video', embedData, Quill.sources.USER)
    quill.setSelection(range.index + 2, Quill.sources.SILENT)
    document.querySelector('.url-area').remove() // tempat paste url
    document.querySelector('.url-area').removeAttribute('class') // tempat kursor bawah figure
  },

  // https://gist.github.com/takien/4077195, at RyanCasas comment
  getYoutubeId = function (url) {
    url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)
    return undefined !== url[2]?url[2].split(/[^0-9a-z_\-]/i)[0]:url[0]
  },

  detectEmbedUrl = function (url) {
    var rt = {}
    if ((url.match(/^(https?):\/\/(www\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/i)) || (url.match(/^(https?):\/\/(www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/i))) {
      rt = {
        id: getYoutubeId(url),
        source: 'youtube'
      }
    };
    if (url.match(/^(https?):\/\/(www\.)?vimeo\.com\/(\d+)/i)) {
      rt = {
        id: '',
        source: 'vimeo'
      }
    };
    if (url.match(/^(https?):\/\/(www\.|mobile\.)?twitter\.com\/(.+)\/status\/(\d+)/i)) {
      rt = {
        id: '',
        source: 'twitter'
      }
    };
    if (url.match(/^(https?):\/\/(t\.me|telegram\.me|telegram\.dog)\/([a-zA-Z0-9_]+)\/(\d+)/i)) {
      rt = {
        id: '',
        source: 'telegram'
      }
    };

    return rt
  },

  readUrl = function (url) {
    var rt = true
    var sourceFrom = detectEmbedUrl(url)
    if (sourceFrom.source.toLowerCase() === 'youtube') {
      var embedData = {
        source: sourceFrom.source.toLowerCase(),
        id: sourceFrom.id
      }
      makeEmbedVideoCode(embedData)
      rt = false
    }

    return rt;
  };

var Block = Quill.import('blots/block')
var BlockEmbed = Quill.import('blots/block/embed')
var Keyboard = Quill.import('modules/keyboard')
var Clipboard = Quill.import('modules/clipboard')
var Delta = Quill.import('delta')

class DividerBlot extends BlockEmbed { }
DividerBlot.blotName = 'divider'
DividerBlot.tagName = 'hr'

class VideoBlot extends BlockEmbed {

  static embedUrl(source) {
    var rt = ''
    if (source.toLowerCase() === 'youtube') {
      rt = 'https://www.youtube.com/embed/'
    }

    return rt;
  }

  static create(embedData) {
    var embedUrl = this.embedUrl(embedData.source)
    var url = embedUrl + embedData.id
    var node = super.create()
    node.setAttribute('src', url)
    node.setAttribute('data-source', embedData.source.toLowerCase())
    node.setAttribute('data-id', embedData.id)
    node.setAttribute('frameborder', '0')
    node.setAttribute('allowfullscreen', true)

    var wrapper = document.createElement('div')
    wrapper.setAttribute('class', 'object-wrapper')
    wrapper.appendChild(node)

    var figcaption = document.createElement('figcaption')
    figcaption.setAttribute('contenteditable', true)
    figcaption.setAttribute('data-placeholder', 'Judul (opsional)')
    figcaption.innerText = embedData.caption ? embedData.caption : ''

    var figure = document.createElement('figure')
    figure.setAttribute('contenteditable', false)
    figure.appendChild(wrapper)
    figure.appendChild(figcaption)

    return figure
  }

  static value(figure) {
    return {
      source: figure.getElementsByTagName('iframe')[0].getAttribute('data-source'),
      id: figure.getElementsByTagName('iframe')[0].getAttribute('data-id'),
      caption: figure.getElementsByTagName('figcaption')[0].innerHTML
    }
  }
}

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

VideoBlot.blotName = 'video'
VideoBlot.tagName = 'iframe'

Quill.register(DividerBlot)
Quill.register(VideoBlot)
Quill.register('modules/clipboard', PlainClipboard, true)

var quill = new Quill('#editor-container', {
  theme: 'bubble'
})

quill.addContainer($("#sidebar-controls").get(0))
quill.on(Quill.events.EDITOR_CHANGE, function (eventType, range) {
  removePlaceholder()
  if (eventType !== Quill.events.SELECTION_CHANGE) return
  if (range == null) return
  if (range.length === 0) {
    var [block, offset] = quill.scroll.descendant(Block, range.index)
    if (block != null && block.domNode.firstChild instanceof HTMLBRElement && !isSelectionInsideElement('li')) {
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
  // console.log('Delta:', delta.ops)
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
    r || (i.domNode.setAttribute("data-placeholder", "Tempelkan tautan YouTube dan tekan Enter"), $(i.domNode).addClass("embed-area url-area"), $('#sidebar-controls').fadeOut())
  }
});

quill.keyboard.addBinding({ key: Keyboard.keys.ENTER }, function (t, e) {
  var a = quill,
    o = a.scroll.line(t.index),
    l = slicedToArray(o, 2),
    i = l[0],
    r = l[1];
  if (i) {
    var n = i.domNode.innerText,
      s = n.substr(0, r),
      u = void 0;
    if (u = s.match(/(^|\s)(https?:\/\/\S+)$/)) {
      return readUrl(u[2])
    } else {
      return true
    }
  }
});

quill.keyboard.bindings[Keyboard.keys.ENTER].unshift(quill.keyboard.bindings[Keyboard.keys.ENTER].pop())

// set contents
var contents = [{ "insert": "Toshi Omagari’s updated version opens up the typeface - version opens up the typeface" }, { "attributes": { "header": 1 }, "insert": "\n" }, { "insert": "The decorative blackletter – " }, { "attributes": { "link": "#" }, "insert": "which offers a stark contrast with" }, { "insert": " the other four typefaces included in the Wolpe Collection – drew on Berthold Wolpe’s time working in a metal foundry. As a result, it adopts the kinds of angular forms that would have been more easily chiselled into metal – appearing slightly less intricate than fellow blackletter faces.\nAn early specimen sheet, published in 1938, said the typeface was intending to cause a stir among “horizon-scanning advertisers”, however the design quickly fell into obscurity, particularly as a result of blackletter’s connotations." }, { "attributes": { "blockquote": true }, "insert": "\n" }, { "insert": "An early specimen sheet" }, { "attributes": { "header": 2 }, "insert": "\n" }, { "insert": "List Pertama" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "List Kedua" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "List Ketiga" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "List Keempat" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "List Kelima" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "An early specimen sheet" }, { "attributes": { "header": 2 }, "insert": "\n" }, { "insert": "List Pertama" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "List Kedua" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "List Ketiga" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "List Keempat" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "List Kelima" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "There were reportedly only two sets of matrices ever made of Sachsenwald, which otherwise has lived on only through original drawings held by the Monotype archive. \n" }, { "insert": { "divider": true } }, { "insert": "As you’d expect, examples of it being used are limited, however it can be seen in a rare edition of the Rubaiyat of Omar Khayyam, published by Fanfare Press in the 1940s.\n" }, { "insert": { "video": { "source": "youtube", "id": "_Th1GTJmL2Y", "caption": "Ini Judul Video" } } }, { "insert": "Toshi Omagari’s updated version opens up the typeface for experimentation by today’s designers, and also introduces elements that make it easier for today’s purposes – including a romanized version of the distinctive traditional German X originally used in Sachsenwald.\nGet the Sachsenwald typeface" }, { "attributes": { "header": 2 }, "insert": "\n" }, { "insert": "View the web specimen for Sachsenwald and The Wolpe Collection. All five families are included in Monotype Library Subscription. Get unlimited access to over 10,000 fonts for $9.99/month. Try it now for free.\nHeading 1" }, { "attributes": { "header": 1 }, "insert": "\n" }, { "insert": "Heading 2" }, { "attributes": { "header": 2 }, "insert": "\n" }, { "insert": "Heading 3" }, { "attributes": { "header": 3 }, "insert": "\n" }, { "insert": "Heading 4" }, { "attributes": { "header": 4 }, "insert": "\n" }, { "insert": "Heading 5" }, { "attributes": { "header": 5 }, "insert": "\n" }, { "insert": "Heading 6" }, { "attributes": { "header": 6 }, "insert": "\n" }]
quill.setContents(contents)
