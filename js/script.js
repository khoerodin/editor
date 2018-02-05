var Block = Quill.import('blots/block');
var BlockEmbed = Quill.import('blots/block/embed');
var Keyboard = Quill.import('modules/keyboard');
var quill = new Quill('#editor-container', {
  theme: 'bubble'
})

var isSelectionInsideElement = function (tagName) {
  var sel, containerNode;
  tagName = tagName.toUpperCase();
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount > 0) {
      containerNode = sel.getRangeAt(0).commonAncestorContainer;
    }
  } else if ((sel = document.selection) && sel.type != "Control") {
    containerNode = sel.createRange().parentElement();
  }
  while (containerNode) {
    if (containerNode.nodeType == 1 && containerNode.tagName == tagName) {
      return true;
    }
    containerNode = containerNode.parentNode;
  }
  return false;
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
      if (Array.isArray(e)) return e;
      if (Symbol.iterator in Object(e)) return t(e, o);
      throw new TypeError("Invalid attempt to destructure non-iterable instance")
    }
  }(),

  removePlaceholder = function () {
    $(".embed-area").removeAttr("data-placeholder").removeClass("embed-area")
  },

  makeEmbedVideoCode = function (url) {
    var range = quill.getSelection(true);
    quill.insertEmbed(range.index, 'video', url, Quill.sources.USER);
    quill.setSelection(range.index + 2, Quill.sources.SILENT);
    document.querySelector('p.url-area').remove();
    document.querySelector('.url-area').removeAttribute('class')
  },

  detectEmbedUrl = function (t) {
    var e = void 0;
    var rt = true;
    if ((e = t.match(/^(https?):\/\/(www\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/i)) || (e = t.match(/^(https?):\/\/(www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/i))) {
      var url = 'https://www.youtube.com/embed/' + t.split("?v=")[1];
      makeEmbedVideoCode(url);
      rt = false;
    };
    if (e = t.match(/^(https?):\/\/(www\.)?vimeo\.com\/(\d+)/i)) {

    };
    if (e = t.match(/^(https?):\/\/(www\.|mobile\.)?twitter\.com\/(.+)\/status\/(\d+)/i)) {

    };
    if (e = t.match(/^(https?):\/\/(t\.me|telegram\.me|telegram\.dog)\/([a-zA-Z0-9_]+)\/(\d+)/i)) {

    };

    return rt;
  };

quill.addContainer($("#sidebar-controls").get(0));
quill.on(Quill.events.EDITOR_CHANGE, function (eventType, range) {
  removePlaceholder()
  if (eventType !== Quill.events.SELECTION_CHANGE) return;
  if (range == null) return;
  if (range.length === 0) {
    var [block, offset] = quill.scroll.descendant(Block, range.index);
    if (block != null && block.domNode.firstChild instanceof HTMLBRElement && !isSelectionInsideElement('li')) {
      var lineBounds = quill.getBounds(range);
      $('#sidebar-controls').show().css({
        left: lineBounds.left - 120,
        top: lineBounds.top - 2
      });
    } else {
      $('#sidebar-controls').fadeOut();
    }
  } else {
    $('#sidebar-controls').fadeOut();
  }

  var delta = quill.getContents();
  console.log('Delta:', delta.ops)
});

class DividerBlot extends BlockEmbed { }
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';

class VideoBlot extends BlockEmbed {
  static create(url) {
    var node = super.create();
    node.setAttribute('src', url);
    node.setAttribute('frameborder', '0');
    node.setAttribute('allowfullscreen', true);

    var wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'object-wrapper')
    wrapper.appendChild(node);

    var figcaption = document.createElement('figcaption');

    var figure = document.createElement('figure');
    figure.appendChild(wrapper);
    figure.appendChild(figcaption);

    return figure;
  }

  static value(figure) {
    return figure.getElementsByTagName('iframe')[0].getAttribute('src');
  }
}
VideoBlot.blotName = 'video';
VideoBlot.tagName = 'iframe';

Quill.register(DividerBlot);
Quill.register(VideoBlot);

$('#divider-button').click(function () {
  var range = quill.getSelection(true);
  quill.insertEmbed(range.index, 'divider', true, Quill.sources.USER);
  quill.setSelection(range.index + 1, Quill.sources.SILENT);
  $('#sidebar-controls').fadeOut();
});

$('#embed-button').click(function () {
  var e = quill.getSelection(!0),
    o = quill.scroll.line(e.index),
    l = slicedToArray(o, 1),
    i = l[0];
  if (i) {
    var r = $(i.domNode).text();
    r || (i.domNode.setAttribute("data-placeholder", "Paste a YouTube, Vimeo or Twitter link, and press Enter"), $(i.domNode).addClass("embed-area url-area"), $('#sidebar-controls').fadeOut())
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
      return detectEmbedUrl(u[2])
    } else {
      return true
    }
  }
});

quill.keyboard.bindings[Keyboard.keys.ENTER].unshift(quill.keyboard.bindings[Keyboard.keys.ENTER].pop())

// set contents
var contents = [{"insert":"Toshi Omagari’s updated version opens up the typeface - version opens up the typeface"},{"attributes":{"header":1},"insert":"\n"},{"insert":"The decorative blackletter – "},{"attributes":{"link":"#"},"insert":"which offers a stark contrast with"},{"insert":" the other four typefaces included in the Wolpe Collection – drew on Berthold Wolpe’s time working in a metal foundry. As a result, it adopts the kinds of angular forms that would have been more easily chiselled into metal – appearing slightly less intricate than fellow blackletter faces.\nAn early specimen sheet, published in 1938, said the typeface was intending to cause a stir among “horizon-scanning advertisers”, however the design quickly fell into obscurity, particularly as a result of blackletter’s connotations."},{"attributes":{"blockquote":true},"insert":"\n"},{"insert":"An early specimen sheet"},{"attributes":{"header":2},"insert":"\n"},{"insert":"List Pertama"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"List Kedua"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"List Ketiga"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"List Keempat"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"List Kelima"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"An early specimen sheet"},{"attributes":{"header":2},"insert":"\n"},{"insert":"List Pertama"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"List Kedua"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"List Ketiga"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"List Keempat"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"List Kelima"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"There were reportedly only two sets of matrices ever made of Sachsenwald, which otherwise has lived on only through original drawings held by the Monotype archive. \n"},{"insert":{"divider":true}},{"insert":"As you’d expect, examples of it being used are limited, however it can be seen in a rare edition of the Rubaiyat of Omar Khayyam, published by Fanfare Press in the 1940s.\n"},{"insert":{"video":"https://www.youtube.com/embed/XlkV1Z8rTYc"}},{"insert":"Toshi Omagari’s updated version opens up the typeface for experimentation by today’s designers, and also introduces elements that make it easier for today’s purposes – including a romanized version of the distinctive traditional German X originally used in Sachsenwald.\nGet the Sachsenwald typeface"},{"attributes":{"header":2},"insert":"\n"},{"insert":"View the web specimen for Sachsenwald and The Wolpe Collection. All five families are included in Monotype Library Subscription. Get unlimited access to over 10,000 fonts for $9.99/month. Try it now for free.\nHeading 1"},{"attributes":{"header":1},"insert":"\n"},{"insert":"Heading 2"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Heading 3"},{"attributes":{"header":3},"insert":"\n"},{"insert":"Heading 4"},{"attributes":{"header":4},"insert":"\n"},{"insert":"Heading 5"},{"attributes":{"header":5},"insert":"\n"},{"insert":"Heading 6"},{"attributes":{"header":6},"insert":"\n"}]
quill.setContents(contents);
