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
    $provider = strtolower($embed->providerName);
    if ($type !== 'photo' && $type !== 'link') {
      return $this->$provider($embed);
    }

    return false;
  }

  function twitter($embed)
  {
    $id = end(explode('/', $embed->url));

    echo "<!DOCTYPE html>\n";
    echo "<html>\n";
    echo "  <head>\n";
    echo "    <meta charset=\"utf-8\">\n";
    echo "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no\" />\n";
    echo "    <meta name=\"format-detection\" content=\"telephone=no\" />\n";
    echo "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n";
    echo "    <meta name=\"MobileOptimized\" content=\"320\" />\n";
    echo "    <meta name=\"twitter:widgets:csp\" content=\"on\">\n";
    echo "    <script src=\"//platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>\n";
    echo "    <style>body{margin:0;padding:0}.twitter-tweet{margin:0 auto!important}</style>\n";
    echo "  </head>\n";
    echo "  <body onresize=\"resize()\">\n";
    echo "    <div id=\"tweet\"></div>\n";
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
    echo "      window.twttr&&twttr.widgets&&twttr.widgets.createTweet(\"". $id ."\",document.getElementById(\"tweet\"), resize);\n";
    echo "    </script>\n";
    echo "  </body>\n";
    echo "</html>";
  }

  function youtube($embed)
  {
    $id = end(explode('?v=', $embed->url));

    echo "<!DOCTYPE html>\n";
    echo "<html>\n";
    echo "  <head>\n";
    echo "    <meta charset=\"utf-8\">\n";
    echo "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no\" />\n";
    echo "    <meta name=\"format-detection\" content=\"telephone=no\" />\n";
    echo "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n";
    echo "    <meta name=\"MobileOptimized\" content=\"320\" />\n";
    echo "    <style>body{margin:0;padding:0}html,body,iframe{height:100%}</style>\n";
    echo "  </head>\n";
    echo "  <body onresize=\"resize()\">\n";
    echo "    <iframe width=\"100%\" height=\"100%\" src=\"//www.youtube.com/embed/". $id ."?rel=0&showinfo=0\" frameborder=\"0\" allowtransparency=\"true\" allowfullscreen=\"true\"></iframe>\n";
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
    echo "    </script>\n";
    echo "  </body>\n";
    echo "</html>";
  }

  function vimeo($embed)
  {
    $id = end(explode('/', $embed->url));

    echo "<!DOCTYPE html>\n";
    echo "<html>\n";
    echo "  <head>\n";
    echo "    <meta charset=\"utf-8\">\n";
    echo "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no\" />\n";
    echo "    <meta name=\"format-detection\" content=\"telephone=no\" />\n";
    echo "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n";
    echo "    <meta name=\"MobileOptimized\" content=\"320\" />\n";
    echo "    <style>body{margin:0;padding:0}html,body,iframe{height:100%}</style>\n";
    echo "  </head>\n";
    echo "  <body onresize=\"resize()\">\n";
    echo "    <iframe width=\"100%\" height=\"100%\" src=\"//player.vimeo.com/video/". $id ."/\" frameborder=\"0\" allowtransparency=\"true\" allowfullscreen=\"true\"></iframe>\n";
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
    echo "    </script>\n";
    echo "  </body>\n";
    echo "</html>";
  }
}

return new Grab($url);
