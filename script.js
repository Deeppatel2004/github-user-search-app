function buildUrl(username) {
    return 'https://api.github.com/users/' + username.trim();
}

function pickUser(data) {
  return {
    login: data.login,
    name: data.name || data.login,
    avatar: data.avatar_url,
    repos: data.public_repos,
    bio: data.bio,
    location: data.location
  };
}

function statusMessage(status) {
  if (status === 200) {
    return 'OK';
  } else if (status === 404) {
    return 'User not found';
  } else if (status === 403) {
    return 'Too many requests. Try later.';
  } else {
    return 'Something went wrong';
  }
}

const searchForm = document.querySelector('#searchForm');
const usernameInput = document.querySelector('#usernameInput');
const message = document.querySelector('#message');
const card = document.querySelector('#card');

searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  message.textContent = 'Loading...';
  card.innerHTML = '';

  try {
    const response = await fetch(buildUrl(usernameInput.value));

    if (!response.ok) {
      message.textContent = statusMessage(response.status);
      return;
    }

    const data = await response.json();
    const user = pickUser(data);

    message.textContent = '';

    card.innerHTML = `
      <img src="${user.avatar}" alt="${user.login}">
      <h2>${user.name}</h2>
      <p>Login: ${user.login}</p>
      <p>Repositories: ${user.repos}</p>
      <p>Bio: ${user.bio || "No bio"}</p>
       <p>Location: ${user.location || "No location"}</p>
    `;

  } catch (error) {
    message.textContent = 'No internet. Try again.';
  }
});