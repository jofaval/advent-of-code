<?php

/**
 * @param array[string,any] $challenge
 */
function read(array $challenge, bool $allow_empty_content = false): string
{
    $content = "";

    // no empty content/input should be allowed by default
    if (!$allow_empty_content && strlen($content) <= 0) {
        throw new Exception("The content for " . get_challenge_as_string($challenge), 1);
    }

    return $content;
}
