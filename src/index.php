<?php
$github_user = 'osieks';
$opts = [
    'http' => [
        'method' => 'GET',
        'header' => [
            'User-Agent: PHP',
            'Authorization: token ' . getenv('GITHUB_TOKEN')
        ]
    ]
];
$context = stream_context_create($opts);
$github_projects = json_decode(file_get_contents("https://api.github.com/users/$github_user/repos", false, $context));

echo "<!DOCTYPE html>";
echo "<html>";
echo "<head>";
echo "<link rel='stylesheet' type='text/css' href='styles.css'>";
echo "</head>";
echo "<body>";

foreach ($github_projects as $project) {
    echo "<div class='project' data-repo='{$project->name}'>";
    echo "<h2><a href='{$project->html_url}'>{$project->name}</a></h2>";
    echo "<p>{$project->description}</p>";
    echo "</div>";
}

echo "<div id='slide-tab'></div>";

echo "<script src='scripts.js'></script>";
echo "</body>";
echo "</html>";
?>
