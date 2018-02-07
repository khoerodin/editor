<?php
require __DIR__ . '../../vendor/autoload.php';

use Embed\Embed;

$url = isset($_GET['url']) ? $_GET['url'] : '';

class Grab {
  function __construct($url)
  {
    if (empty($url) || !filter_var($url, FILTER_VALIDATE_URL)) {
      return false;
    }

    $embed = Embed::create($url);
    $type = $embed->type;
    if ($type !== 'photo' && $type !== 'link') {
      return $this->$type($embed);
    }

    return false;
  }

  function video($embed)
  {
    echo "<!DOCTYPE html>\n";
    echo "<html>\n";
    echo "  <head>\n";
    echo "    <meta charset=\"utf-8\">\n";
    echo "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no\" />\n";
    echo "    <meta name=\"format-detection\" content=\"telephone=no\" />\n";
    echo "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n";
    echo "    <meta name=\"MobileOptimized\" content=\"320\" />\n";
    echo "    <style>body{margin:0;padding:0}html,body,iframe,video,object,embed{height:100%;width:100%;overflow:hidden;}</style>\n";
    echo "  </head>\n";
    echo "  <body onresize=\"resize()\">\n";
    echo "    " . $embed->code;
    echo "    <script>\n";
    echo "      var _htmlNode = document.getElementsByTagName('html')[0];\n";
    echo "      var _maxHeight = 0;\n";
    echo "      function resize() {\n";
    echo "        if (parent && parent._resizeIframe) {\n";
    echo "          var width  = _htmlNode.offsetWidth;\n";
    echo "          var height = _maxHeight ? Math.min(_maxHeight, _htmlNode.offsetHeight) : _htmlNode.offsetHeight;\n";
    echo "          parent._resizeIframe(window, width, height);\n";
    echo "        }\n";
    echo "      };\n";
    echo "      var frames = document.getElementsByTagName('iframe');\n";
    echo "      for (var i = 0; i < frames.length; (frames[i].onload = resize), i++);\n";
    echo "      var videos = document.getElementsByTagName('video');\n";
    echo "      for (var i = 0; i < videos.length; (videos[i].onload = resize), i++);\n";
    echo "      var objects = document.getElementsByTagName('object');\n";
    echo "      for (var i = 0; i < objects.length; (objects[i].onload = resize), i++);\n";
    echo "      var embeds = document.getElementsByTagName('embed');\n";
    echo "      for (var i = 0; i < embeds.length; (embeds[i].onload = resize), i++);\n";
    echo "    </script>\n";
    echo "  </body>\n";
    echo "</html>";
  }

  function rich($embed)
  {
    echo "<!DOCTYPE html>\n";
    echo "<html>\n";
    echo "  <head>\n";
    echo "    <meta charset=\"utf-8\">\n";
    echo "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no\" />\n";
    echo "    <meta name=\"format-detection\" content=\"telephone=no\" />\n";
    echo "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n";
    echo "    <meta name=\"MobileOptimized\" content=\"320\" />\n";
    echo "    <style>body{margin:0;padding:0}.twitter-tweet{margin:0 auto!important}</style>\n";
    echo "  </head>\n";
    echo "  <body onresize=\"resize()\">\n";
    echo "    <div id=\"rich-media\">\n";
    echo "    <center>" . $embed->code . "</center>\n";
    echo "    </div>\n";
    echo "    <script>\n";
    echo "      var _htmlNode = document.getElementsByTagName('html')[0];\n";
    echo "      var _maxHeight = 0;\n";
    echo "      function resize() {\n";
    echo "        if (parent && parent._resizeIframe) {\n";
    echo "          var width  = _htmlNode.offsetWidth;\n";
    echo "          var height = _maxHeight ? Math.min(_maxHeight, _htmlNode.offsetHeight) : _htmlNode.offsetHeight;\n";
    echo "          parent._resizeIframe(window, width, height);\n";
    echo "        }\n";
    echo "      };\n";
    echo "      var frames = document.getElementsByTagName('iframe');\n";
    echo "      for (var i = 0; i < frames.length; (frames[i].onload = resize), i++);\n";
    echo "      document.getElementById(\"rich-media\").onload = resize;\n";
    echo "    </script>\n";
    echo "  </body>\n";
    echo "</html>";
  }
}

return new Grab($url);
