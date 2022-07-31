search = document.getElementById('search'); // Search input
title = document.getElementById('title'); // Title
dir = document.getElementById('dir'); // Directory Listing

url = `https://api.github.com/repos/${user}/${repo}/contents/`; // Base URL
components = []; // Extended path

// Regex test filenames
async function checkDir(fileName) {
  fObject = await (await fetch(url + fileName)).json(); // File object
  console.log(url + fileName);
  console.log(fObject);

  return (fObject.constructor === Array ? true : false) // Check if it is an array or object
}

// Regex get folder/filename
async function fnameGet(fileName) {
  return fileName.match(/((?!.*(\/|\\))).*/g)[0]
}

// Open file/dir function
async function openFile(path) {
  if (path == '..') {
    components.pop();
  } else if (await checkDir(path)) {
    components.push(await fnameGet(path));
  } else {
    window.open(path);
  }

  // Force dir/title to update
  dir.innerHTML = "Start typing something to begin";
  title.innerHTML = components.length == 0 ? repo : components[components.length - 1];
}


// Get file information
async function getContents() {
//  console.log(url + components.join('/'));
  fObject = await (await fetch(url + components.join('/'))).json(); // File object
  return fObject;
}

// Generate file list
async function listDir(data) {
  let htmlString = '<ul>';
  if (!(components.length == 0)) {
    title.innerHTML = components[components.length - 1];
    htmlString += `<li><a onclick="openFile('..')">..</a></li>`;
  } else {
    title.innerHTML = repo;
  }
  
  for (let file of data) {
    if (file.name.toLowerCase().startsWith(search.value)) {
      htmlString += `<li><a onclick="openFile('${file.path}')">${file.name}</a></li>`;
    }
  }

  htmlString += '</ul>';

  dir.innerHTML = htmlString;
}

title.innerHTML = repo;
search.oninput = () => {
  getContents().then((data) => {
    listDir(data);
  });
};
