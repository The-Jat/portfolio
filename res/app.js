
const artText = "\
    * Cat background: [Pixel Jeff](https://www.behance.net/gallery/103154127/SUDIO) on Behance\n\
    * Plant background: [@minimossart](https://twitter.com/minimossart) on Twitter\n\
    * Blue background: [5ldo0on](https://www.deviantart.com/5ldo0on/art/Evening-Lights-895346742) on DeviantArt\n\
    * Pink Floyd fan art: [@MemeGrower](https://www.pixilart.com/art/pink-floyd-dark-side-of-the-moon-c033a73131ef078)\n\
    * Madeline & Badeline from [Celeste](https://store.steampowered.com/app/504230/Celeste/): [Pixel Art Maker](http://pixelartmaker.com/art/b2812518a5adf71)\n\
    * Folder icon: [Pixel Art Maker](http://pixelartmaker.com/art/e4800219f1710c9)\n\
    * Settings icon: [Kind PNG](https://www.kindpng.com/imgv/ThwoJoT_transparent-settings-icon-png-companion-cube-pixel-art/)\n\
    * GitHub logo: [Pixel Art Maker](http://pixelartmaker.com/art/d7e4e1e509c728d)\n\
    * Clipboard icon: [Nicholas Zaharias](http://www.ngzaharias.com/blog/2018/9/3/pixel-art)\n\
    * Email icon: [Pixel Art Maker](http://pixelartmaker.com/art/53c6e86088e2560)\n\
    * Font: [Agave](https://b.agaric.net/page/agave), distributed under the [MIT license](https://github.com/blobject/agave/blob/master/LICENSE)";

const contactText = "\
    * Email: [manishkl543@gmail.com](mailto:manishkl543@gmail.com)\n\
    * GitHub: [The-Jat](https://github.com/The-Jat)\n\
    * [LinkedIn profile](https://www.linkedin.com/in/manish-kala-46a845139)\n\
    * Website: [The-Jat](https://www.thejat.in)";


const meText = "\
    Hi There! I'm Manish Kala, a software developer with a strong curiosity about how things work.\n\
    I enjoy working with C and C++ because they allow me to work close to the hardware,\
    optimize performance, and build powerful, low-level systems.";


const cookieNotice = "\
    *Notice: *The functionality provided here uses cookies to deliver you the best possible experience. By changing settings here, you consent to using cookies.";

function showArt() {
    if(getWindow("art")) {
        setActiveWindow("art");
        return;
    }

    createWindow("art", "Art Credits", 36, -1, 0, 0);
    createImage("art", "/res/images/celeste.png", "Madeline & Badeline from Celeste", 33, 33, 2);
    dialog("art", artText, "OK");
    randomizeWindowPosition("art");
    showWindow("art");
}

var response, posts;
var blogMd;

// loads the blog but without showing the window
async function loadBlog() {
    // generate list of blog posts
    blogMd = new String();
    blogMd = "";

    response = await fetch("res/posts/posts.json");
    if(!response.ok || response.status != 200) {
        messageBox("Error", "Failed to load list of blog posts; check your internet connection.", "OK");
        return;
    }

    posts = await response.json();
    //debug(posts.posts.length);
}

// uses above function to load the blog + shows the window
async function openBlog() {
    if(getWindow("blog")) {
        setActiveWindow("blog");
        return;
    }

    await loadBlog();

    for(var i = 0; i < posts.posts.length; i++) {
        blogMd += "* [" + posts.posts[i].title + "](bp:" + posts.posts[i].id + ") - " + timeString(posts.posts[i].time) + "\n";
    }

    createWindow("blog", "Blog", 48, 35, 0, 0);
    createText("blog", blogMd);
    setScrollable("blog", true);
    showWindow("blog");
}

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function timeString(t) {
    var elapsed = (Date.now() / 1000) - t;
    var str = new String();

    if(elapsed < 60) {
        str = "just now";
    } else if(elapsed < 3600) {
        var min = Math.floor(elapsed/60);
        if(min < 10 && min > 3) str = "a few minutes ago";
        else if(min >= 10) str = min + " minutes ago";
        else str = "just now";
    } else if(elapsed < 86400) {
        var hour = Math.floor(elapsed/3600);
        if(hour != 1) str = hour + " hours ago";
        else str = "an hour ago";
    } else if(elapsed < 604800) {
        var day = Math.floor(elapsed/86400);
        if(day != 1) str = day + " days ago";
        else str = "yesterday";
    } else {
        var timestamp = new Date(t * 1000);
        str = timestamp.getDate() + " " + months[timestamp.getMonth()] + " " + timestamp.getFullYear();
    }

    return str;
}

function updateURI(uri) {
    if(window.history.replaceState)     // check for old browsers
        window.history.replaceState(null, "", uri);
}

// opens a specific blog post
// returns true if successful
async function openBlogPost(id, silence=false) {
    if(getWindow("post_" + id)) {
        setActiveWindow("post_" + id);
        return true;
    }

    let response = await fetch("res/posts/" + id + ".md");
    if(!response.ok || response.status != 200) {
        error("failed to load blog post ID " + id);
        if(!silence) {
            messageBox("Error", "Failed to load blog post; check your internet connection.", "OK");
        }
        return false;
    }

    let post = await response.text();

    var i;
    for(i = 0; i < posts.posts.length; i++) {
        if(posts.posts[i].id == id) break;
    }

    createWindow("post_" + id, posts.posts[i].title, 48, 74, 0, 0);

    createText("post_" + id, "# " + posts.posts[i].title);
    createText("post_" + id, "**- " + timeString(posts.posts[i].time) + "**");

    createText("post_" + id, post);
    setScrollable("post_" + id, true);

    // event handlers for the post ID in the URI
    addWindowEvent("post_" + id, windowEventClose, function() {
        updateURI("/");
    });

    addWindowEvent("post_" + id, windowEventClick, function() {
        updateURI("?p=" + id);
    });

    showWindow("post_" + id);

    updateURI("?p=" + id);
    return true;
}

function mainWindow() {
    if(getWindow("main")) {
        setActiveWindow("main");
        return;
    }

    createWindow("main", "About", 42, -1, -1, -1);

    let theme = getTheme();
    let avatar;
    switch(theme) {
    case purpleTheme:
        avatar = "res/images/programmer.png";
        break;
    case greenTheme:
        avatar = "res/images/programmer.png";
        break;
    default:
        avatar = "res/images/programmer.png";
    }

    createImage("main", avatar, "Avatar", 33, 33, 2);
    createText("main", meText);
    centerWindow("main");
    showWindow("main");
}

function openContact() {
    if(getWindow("contact")) {
        setActiveWindow("contact");
        return;
    }

    createWindow("contact", "Contact", 31, -1, 0, 0);
    createImage("contact", "res/images/The_Jat_Logo_500x500.png", "Pink Floyd - The Dark Side of the Moon Pixel Art", 37, 37, 2);
    dialog("contact", contactText, "OK");
    randomizeWindowPosition("contact");
    showWindow("contact");
}

function openSettings() {
    if(getWindow("settings")) {
        setActiveWindow("settings");
        return;
    }

    createWindow("settings", "Settings", 35, -1, 0, 0);
    createText("settings", cookieNotice);

    createText("settings", "Select the theme you want to use.");

    createForm("settings", "settingsForm", "none", "", function(f) { return changeSettings(f); });

    createRadioButton("settingsForm", "theme", "purple", "Purple");
    createRadioButton("settingsForm", "theme", "green", "Green");
    createRadioButton("settingsForm", "theme", "blue", "Blue");
    createRadioButton("settingsForm", "theme", "random", "Random");

    createSubmitButton("settingsForm", "Apply");

    randomizeWindowPosition("settings");
    showWindow("settings");
}

function changeSettings(f) {
    const form = document.getElementById("settingsForm");
    const val = form.theme.value;

    setCookie("theme", val);

    if(val == "purple") {
        setTheme(purpleTheme);
    } else if(val == "green") {
        setTheme(greenTheme);
    } else if(val == "blue") {
        setTheme(blueTheme);
    } else {
        // random
        setTheme(randomTheme);
    }

    let theme = getTheme();
    let avatar;
    switch(theme) {
    case purpleTheme:
        avatar = "res/images/avatar.png";
        break;
    case greenTheme:
        avatar = "res/images/avatarcity.png";
        break;
    default:
        avatar = "res/images/avatarnight.png";
    }

    debug("update avatar");

    const c = getWindowChildren("main");
    debug(c);
    if(c) {
        for(let i = 0; i < c.length; i++) {
            debug(i + " " + c[i].tagName)
            if(c[i].tagName.toLowerCase() == "div") {
                c[i].children[0].src = avatar;
                return false;
            }
        }
    }

    return false;
}

async function appMain() {
    addMenuItem("About", mainWindow);
//    addMenuItem("Blog", async function() { await openBlog(); });
    addMenuItem("GitHub", function() { window.open("https://github.com/The-Jat", "_blank"); });
    addMenuItem("Website", function() {window.open("https://thejat.in", "_blank");});
    addMenuItem("Contact", openContact);
   // addMenuItem("Art Credits", showArt);
    addMenuItem("Settings", openSettings);

    // createDesktopIcon(desktopIconFolder, "Blog", async function() { await openBlog(); });
    createDesktopIcon(desktopIconGitHub, "GitHub", function() { window.open("https://github.com/The-Jat", "_blank"); });
    createDesktopIcon(desktopIconEmail, "Contact", openContact);
    createDesktopIcon(desktopIconGear, "Settings", openSettings);

    // load the post specified by the ?p=ID parameter
    const uri = window.location.search;
    const parameters = new URLSearchParams(uri);

    if(!parameters.has("p")) {
        return mainWindow();
    }

    // let id = parameters.get("p");
    // await loadBlog();
    // if(!await openBlogPost(id, true)) {
    //     // nonexistent blog post
    //     updateURI("/");
    //     return mainWindow();
    // }
}

