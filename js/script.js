var _isSelectionInsideElement = function(tagName) {
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

_slicedToArray = function() {
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
  return function(e, o) {
    if (Array.isArray(e)) return e;
    if (Symbol.iterator in Object(e)) return t(e, o);
    throw new TypeError("Invalid attempt to destructure non-iterable instance")
  }
}(),

_removePlaceholder = function() {
  $(".embed-area").removeAttr("data-placeholder").removeClass("embed-area")
},

_getEmbedCode = async function(i, a, s, url) {
  let embedCode = await $.ajax('http://api.test/api/v1/embeds?c='+url);
  Delta = Quill.import('delta');
  if (embedCode) {
    var h = i.offset(a.scroll);
    return a.updateContents((new Delta).retain(h)["delete"](s.length).insert({
      blockFigure: embedCode
    }), Quill.sources.USER), '', !1
  }
};

let Block = Quill.import('blots/block');
let BlockEmbed = Quill.import('blots/block/embed');
let Keyboard = Quill.import('modules/keyboard');
let quill = new Quill('#editor-container', {
    theme: 'bubble'
})

quill.addContainer($("#sidebar-controls").get(0));
quill.on(Quill.events.EDITOR_CHANGE, function(eventType, range) {
  _removePlaceholder()
  if (eventType !== Quill.events.SELECTION_CHANGE) return;
  if (range == null) return;
  if (range.length === 0) {
    let [block, offset] = quill.scroll.descendant(Block, range.index);
    if (block != null && block.domNode.firstChild instanceof HTMLBRElement && !_isSelectionInsideElement('li')) {
      let lineBounds = quill.getBounds(range);
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
});

class DividerBlot extends BlockEmbed {}
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';

Quill.register(DividerBlot);

$('#divider-button').click(function() {
  let range = quill.getSelection(true);
  quill.insertEmbed(range.index, 'divider', true, Quill.sources.USER);
  quill.setSelection(range.index + 1, Quill.sources.SILENT);
  $('#sidebar-controls').fadeOut();
});

$('#embed-button').click(function() {
  var e = quill.getSelection(!0),
      o = quill.scroll.line(e.index),
      l = _slicedToArray(o, 1),
      i = l[0];
  if (i) {
    var r = $(i.domNode).text();
    r || (i.domNode.setAttribute("data-placeholder", "Paste a YouTube, Vimeo or Twitter link, and press Enter"), $(i.domNode).addClass("embed-area"), $('#sidebar-controls').fadeOut())
  }
});

quill.keyboard.addBinding({ key: Keyboard.keys.ENTER }, function(t, e) {
  var a = quill,
      o = a.scroll.line(t.index),
      l = _slicedToArray(o, 2),
      i = l[0],
      r = l[1];
  if (i) {
      var n = i.domNode.innerText,
          s = n.substr(0, r),
          u = void 0;
      if (u = s.match(/(^|\s)(https?:\/\/\S+)$/)) {
        _getEmbedCode(i, a, s, u[2]);
      }
  }
  return !0
});

quill.keyboard.bindings[Keyboard.keys.ENTER].unshift(quill.keyboard.bindings[Keyboard.keys.ENTER].pop())
