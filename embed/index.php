<?php
require __DIR__ . '../../vendor/autoload.php';

use Embed\Embed;

$url = isset($_GET['url']) ? $_GET['url'] : '';
$embed = Embed::create($url);
echo $embed->code;
