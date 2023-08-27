const socket = io();

document.getElementById('user-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;

  if (username.trim() === '') {
    alert('Please enter your username.');
    return;
  }

  socket.emit('joinChat', username);
  document.querySelector('.user-form').style.display = 'none';
  document.querySelector('.chat').style.display = 'block';
});

document.getElementById('send-button').addEventListener('click', () => {
  const message = document.getElementById('message').value;
  if (message.trim() === '') {
    return;
  }
  socket.emit('chatMessage', { message });
  document.getElementById('message').value = '';
});

socket.on('userStatus', (users) => {
  const userStatusElement = document.getElementById('user-list');
  userStatusElement.innerHTML = '';
  users.forEach((user) => {
    const userElement = document.createElement('div');
    userElement.textContent = `${user.username} (${user.online ? 'Online' : 'Offline'})`;
    userStatusElement.appendChild(userElement);
  });
});

socket.on('chatMessage', (data) => {
  const chatBox = document.getElementById('chat-box');
  const newMessage = document.createElement('div');
  newMessage.className = 'message';
  newMessage.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
  chatBox.appendChild(newMessage);
  chatBox.scrollTop = chatBox.scrollHeight;
});
