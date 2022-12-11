<?php

require_once join(DIRECTORY_SEPARATOR, [__DIR__, 'require.php']);

const Challenge = [
    'star' => 'first',
    'day' => §DAY§,
    'input' => 'test',
];

function parseInput(string $content): string
{
    return $content;
}

function main(): void
{
    $content = read(Challenge);
    $parsed = parseInput($content);

    switch (Challenge['day']) {
        case 'first':
            throw new Exception("No return value was detected for the first star", 1);
        case 'second':
            throw new Exception("No return value was detected for the second star", 1);
    }
}

$result = main();
echo "Result: " . $result;
