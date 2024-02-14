var lastScrollTop = 0;

function checkVisibility() {
    var projects = document.querySelectorAll('.project');
    var window_height = window.innerHeight;
    var st = window.pageYOffset || document.documentElement.scrollTop;
    var scrollDown = true;
    if (st > lastScrollTop){
        scrollDown = true;
    } else {
        scrollDown = false;
    }
    lastScrollTop = st <= 0 ? 0 : st;
    projects.forEach(function(project) {
        var project_top = project.getBoundingClientRect().top;
        var project_bottom = project.getBoundingClientRect().bottom;
        if (project_top < window_height && project_bottom >= 0) {
            if (scrollDown) {
                project.classList.add('visible-down');
                project.classList.remove('visible-up');
            } else {
                project.classList.add('visible-up');
                project.classList.remove('visible-down');
            }
        } else {
            project.classList.remove('visible-down');
            project.classList.remove('visible-up');
        }
    });
}

window.addEventListener('scroll', checkVisibility);
window.addEventListener('load', checkVisibility);

// Add this code
var slideTab = document.getElementById('slide-tab');
var projects = document.querySelectorAll('.project');
projects.forEach(function(project) {
    project.addEventListener('click', function() {
        var repo = this.getAttribute('data-repo');
        fetch('https://api.github.com/repos/osieks/' + repo + '/contents')
            .then(response => response.json())
            .then(data => {
                var files;
                if (Array.isArray(data)) {
                    files = data.map(function(file) {
                        return '<p>' + file.name + '</p>';
                    }).join('');
                } else {
                    files = '<p>There\'s nothing inside this project.</p>';
                }
                slideTab.innerHTML = files;
                slideTab.classList.add('visible');
            });
    });
});

window.addEventListener('click', function(e) {
    if (!slideTab.contains(e.target) && !e.target.classList.contains('project')) {
        slideTab.classList.remove('visible');
    }
});
