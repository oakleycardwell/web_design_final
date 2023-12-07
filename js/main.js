// 1.
function createElemWithText(elementType = 'p', textContent = '', className = '') {
    const element = document.createElement(elementType);
    element.textContent = textContent;
    if (className) element.className = className;
    return element;
}

// 2.
function createSelectOptions(users) {
    if (!users) return undefined;
    return users.map(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        return option;
    });
}

// 3.
function toggleCommentSection(postId) {
    if (postId === undefined) return undefined;

    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (!section) return null;

    section.classList.toggle('hide');
    return section;
}

// 4. 
function toggleCommentButton(postId) {
    if (postId === undefined) return undefined;

    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (!button) return null;

    button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
    return button;
}

// 5. 
function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement)) return undefined;

    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

// 6. 
function addButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.addEventListener('click', function (event) {
                toggleComments(event, postId);
            });
        }
    });
    return Array.from(buttons);
}

// 7. 
function removeButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.removeEventListener('click', function (event) {
                toggleComments(event, postId);
            });
        }
    });
    return Array.from(buttons);
}

// 8. 
function createComments(comments) {
    if (comments === undefined) return undefined;

    const fragment = document.createDocumentFragment();
    comments.forEach(comment => {
        const article = document.createElement('article');
        const h3 = createElemWithText('h3', comment.name);
        const p1 = createElemWithText('p', comment.body);
        const p2 = createElemWithText('p', `From: ${comment.email}`);
        article.append(h3, p1, p2);
        fragment.appendChild(article);
    });
    return fragment;
}

// 9. 
function populateSelectMenu(users) {
    if (users === undefined) return undefined;

    const selectMenu = document.getElementById('selectMenu');
    const options = createSelectOptions(users);
    options.forEach(option => selectMenu.appendChild(option));
    return selectMenu;
}

// 10. 
async function getUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// 11. 
async function getUserPosts(userId) {
    if (userId === undefined) return undefined;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching posts for user ${userId}:`, error);
    }
}

// 12. 
async function getUser(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
    }
}

// 13. 
async function getPostComments(postId) {
    if (postId === undefined) return undefined;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error);
    }
}

// 14. 
async function displayComments(postId) {
    if (postId === undefined) return undefined;
    const section = document.createElement('section');
    section.dataset.postId = postId;
    section.classList.add('comments', 'hide');

    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.appendChild(fragment);

    return section;
}

// 15. 
async function createPosts(posts) {
    if (posts === undefined) return undefined;
    const fragment = document.createDocumentFragment();

    for (const post of posts) {
        const article = document.createElement('article');
        const h2 = createElemWithText('h2', post.title);
        const p1 = createElemWithText('p', post.body);
        const p2 = createElemWithText('p', `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const p3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        const p4 = createElemWithText('p', author.company.catchPhrase);
        const button = createElemWithText('button', 'Show Comments');
        button.dataset.postId = post.id;

        const section = await displayComments(post.id);

        article.append(h2, p1, p2, p3, p4, button, section);
        fragment.appendChild(article);
    }

    return fragment;
}

// 16. 
async function displayPosts(posts) {
    if (!posts) {
        const noPostsElement = document.createElement('p');
        noPostsElement.classList.add('default-text');
        noPostsElement.textContent = 'Select an Employee to display their posts.';
        return noPostsElement;
    }

    const main = document.querySelector('main');
    const postsElement = await createPosts(posts);

    main.appendChild(postsElement);
    return postsElement;
}

// 17. 
function toggleComments(event, postId) {
    if (postId === undefined) return undefined;
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
}

// 18. 
async function refreshPosts(posts) {
    if (posts === undefined) return undefined;
    const removeButtons = removeButtonListeners();
    const main = document.querySelector('main');
    deleteChildElements(main);
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
    return [removeButtons, main, fragment, addButtons];
}

// 19. 
async function selectMenuChangeEventHandler(event) {
    if (event === undefined) return undefined;

    const selectMenu = document.getElementById('selectMenu');
    selectMenu.disabled = true;

    const userId = event?.target?.value || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);

    selectMenu.disabled = false;
    return [userId, posts, refreshPostsArray];
}

// 20. 
async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

// 21. 
function initApp() {
    initPage();
    const selectMenu = document.getElementById('selectMenu');
    selectMenu.addEventListener('change', selectMenuChangeEventHandler);
}

document.addEventListener('DOMContentLoaded', initApp);