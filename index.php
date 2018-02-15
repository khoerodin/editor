<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Editor</title>
    <link href="/css/quill.bubble.css" rel="stylesheet">
    <link href="/css/style.css" rel="stylesheet">
    <link href="/css/wysiwyg.css" rel="stylesheet">
    <link href="/css/wysiwyg-custom.css" rel="stylesheet">
    <link href="/icons/css/font-awesome.min.css" rel="stylesheet">
    <link href="/icons/fas/css/fontawesome.min.css" rel="stylesheet">
    <link href="/icons/fas/css/fa-solid.min.css" rel="stylesheet">
  </head>
  <body>
    <div id="sidebar-controls">
      <button id="divider-button">...</button>
      <button id="embed-button"><i class="fas fa-angle-left"></i>&nbsp;&nbsp;<i class="fas fa-angle-right"></i></button>
      <button id="image-button"><i class="fas fa-picture-o"></i></button>
    </div>
    <div id="editor-container" class="wysiwyg"></div>
    <script src="/js/jquery.min.js"></script>
    <script src="/js/quill.min.js"></script>
    <script src="/js/script.js"></script>
  </body>
</html>
