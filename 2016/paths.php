<?php

/**
 * This is a global configuration file
 */

/**
 * Main path of the project
 * @var string
 */
define("BASE_PATH", __DIR__);

function j(): string
{
    $args = func_get_args();

    return join(DIRECTORY_SEPARATOR, $args);
}

function import(): string
{
    $args = func_get_args();

    return j(__DIR__, $args);
}
