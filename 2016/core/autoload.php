<?php

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
