<?php


function entrypoint(): void
{
    echo join(PHP_EOL, [
        "Hello World!",
        "",
        "This is the elf CLI,",
        "we'll get back to you as soon as we process the command...",
    ]);
}

entrypoint();
