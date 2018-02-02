function isSelectionInsideElement(tagName) {
  var sel, containerNode;
  tagName = tagName.toUpperCase();
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount > 0) {
      containerNode = sel.getRangeAt(0).commonAncestorContainer;
    }
  } else if ( (sel = document.selection) && sel.type != "Control" ) {
    containerNode = sel.createRange().parentElement();
  }
  while (containerNode) {
    if (containerNode.nodeType == 1 && containerNode.tagName == tagName) {
      return true;
    }
    containerNode = containerNode.parentNode;
  }
  return false;
}

let Block = Quill.import('blots/block');
let BlockEmbed = Quill.import('blots/block/embed');
let Keyboard = Quill.import('modules/keyboard');
let quill = new Quill('#editor-container', {
  theme: 'bubble'
});

quill.addContainer($("#sidebar-controls").get(0));
quill.on(Quill.events.EDITOR_CHANGE, function(eventType, range) {
  console.log(isSelectionInsideElement('li'))
  if (eventType !== Quill.events.SELECTION_CHANGE) return;
  if (range == null) return;
  if (range.length === 0) {
    let [block, offset] = quill.scroll.descendant(Block, range.index);
    if (block != null && block.domNode.firstChild instanceof HTMLBRElement && !isSelectionInsideElement('li')) {
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

class DividerBlot extends BlockEmbed { }
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';

Quill.register(DividerBlot);

$('#divider-button').click(function() {
  let range = quill.getSelection(true);
  quill.insertEmbed(range.index, 'divider', true, Quill.sources.USER);
  quill.setSelection(range.index + 1, Quill.sources.SILENT);
  $('#sidebar-controls').fadeOut();
});

quill.on('editor-change', function(eventName, ...args) {
  if (eventName === 'text-change') {
    // console.log('attributes' in quill.getContents().ops[0])
  } else if (eventName === 'selection-change') {
    // console.log('old range', args[0])
  }
});
