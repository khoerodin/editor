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
    echo "  <body>\n";
    echo "    " . $embed->code;
    echo "  </body>\n";
    echo "</html>";
  }

  function rich($embed)
  {
    echo "<script src=\"/js/iframeResizer.contentWindow.min.js\"></script>";
    echo "<center>" . $embed->code . "</center>";
  }
}

return new Grab($url);
