<?php
session_start();

if (isset($_POST['username'])) {
    $_SESSION['username'] = $_POST['username'];
}

$github_user =isset($_SESSION['username']) ? $_SESSION['username'] : 'osieks';
$user_name = isset($_SESSION['username']) ? $_SESSION['username'] : 'Mateusz Dzieżok';

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
echo "<title>$user_name github projects</title>";
echo "<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>";

echo "<link rel='stylesheet' type='text/css' href='styles.css'>";
echo "</head>";
echo "<body>";
echo "<div id='left-tab'>";
echo "<h1 id='username' style='cursor:pointer;'><span style='font-style: italic;border: 1px solid white;'>$user_name <i class='fa fa-caret-down'></i></span> github projects</h1>";
foreach ($github_projects as $project) {
    echo "<div class='project' data-repo='{$project->name}'>";
    echo "<h2><a href='{$project->html_url}'>{$project->name}</a>";
    if ($project->name == 'docker_website') {
        echo " <span style='color:green;'> <-that's me!</span>";
    }
    echo "</h2>";
    echo "<p>{$project->description}</p>";
    echo "</div>";
}

echo "</div>";
echo "<div id='slide-tab'></div>";

echo "<script src='scripts.js'></script>";
echo "<script>
document.getElementById('username').addEventListener('click', function() {
    var username = prompt('Please enter username of other github user:');
    if (username) {
        this.textContent = username + ' github projects';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if (this.status == 200) {
                location.reload();
            }
        };
        xhr.send('username=' + encodeURIComponent(username));
    }
});
</script>";
echo "</body>";
echo "</html>";
?>
