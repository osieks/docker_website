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
        slideTab.innerHTML = '';
        var repo = this.getAttribute('data-repo');
        fetchContents('https://api.github.com/repos/osieks/' + repo + '/contents');
    });
});

function fetchContents(url, indent = '') {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                data.forEach(function(file) {
                    if (file.type === 'dir') {
                        slideTab.innerHTML += indent + '<p class="folder" style="cursor:pointer;" data-file="' + file.url + '">' + file.name + '</p><div class="file-content" style="display: none;"></div>';
                        fetchContents(file.url,'&rdsh;<span style="display: inline; background-color: #222">"' + indent +"</span><br></br>");
                    } else {
                        slideTab.innerHTML += indent + '<p class="file" style="cursor:pointer;" data-file="' + file.url + '">' + file.name + '</p><div class="file-content" style="display: none;"></div>';
                    }
                });
            } else {
                slideTab.innerHTML += '<p>There\'s nothing inside this project or API rate_limit has been exceeded.</p>';
            }
            slideTab.classList.add('visible');
            var fileElements = document.querySelectorAll('.file');
            fileElements.forEach(function(fileElement) {
                fileElement.addEventListener('click', function() {
                    var fileUrl = this.getAttribute('data-file');
                    var fileContentElement = this.nextElementSibling;
                    if (fileContentElement.style.display === 'none') {
                        fetch(fileUrl)
                            .then(response => response.json())
                            .then(data => {
                                if (data.content) {
                                    var decodedContent = atob(data.content);
                                    fileContentElement.textContent = decodedContent;
                                } else {
                                    fileContentElement.textContent = 'Unable to fetch file content.';
                                }
                                fileContentElement.style.display = 'block';
                            });
                    } else {
                        fileContentElement.style.display = 'none';
                    }
                });
            });
        });
}

window.addEventListener('click', function(e) {
    if (!slideTab.contains(e.target) && !e.target.classList.contains('project')) {
        slideTab.classList.remove('visible');
    }
});
