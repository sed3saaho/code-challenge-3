// Your code here
document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch and display movie details
    function fetchMovieDetails() {
      fetch('http://localhost:3000/films/1')
        .then(response => response.json())
        .then(data => {
          // Populate movie details on the page
          document.getElementById('title').innerText = data.title;
          document.getElementById('runtime').innerText = `${data.runtime} minutes`;
          document.getElementById('showtime').innerText = data.showtime;
          document.getElementById('poster').src = data.poster;
          document.getElementById('film-info').innerText = data.description;
  
          const availableTickets = data.capacity - data.tickets_sold;
          document.getElementById('ticket-num').innerText = availableTickets;
          // Conditional statement that checks if the variable available ticket is equal to 0 , if it is , it  updates
          // the text content of an element with id "buy-ticket" to "Sold Out" and disables the button
          if (availableTickets === 0) {
            document.getElementById('buy-ticket').innerText = 'Sold Out';
            document.getElementById('buy-ticket').disabled = true;
          }
        });
    }
  
    // Function to fetch and display movie menu
    function fetchMovieMenu() {
      fetch('http://localhost:3000/films')
   // Promise handler that is taking the response from a previous asynchronous operation and converting it to JSON format
        .then(response => response.json())
   // Promise handler that takes the JSON data recieved from the previous promise and processes it
        .then(data => {
          const filmsList = document.getElementById('films');
          filmsList.innerHTML = ''; // Clear existing list
  // Loop through the array of films and create a new list item for each film
          data.forEach(film => {
            const li = document.createElement('li');
            li.className = 'film item';
            li.innerText = film.title;
            filmsList.appendChild(li);
  
            if (film.capacity - film.tickets_sold === 0) {
              li.classList.add('sold-out');
            }
          });
        });
    }
  
    // Event listener for Buy Ticket button
    document.getElementById('buy-ticket').addEventListener('click', function() {
        // Implement ticket purchasing logic here
        const filmId = 1; // Replace with the actual film ID
        fetch(`http://localhost:3000/films/${filmId}`)
          .then(response => response.json())
          .then(data => {
            if (data.tickets_sold < data.capacity) {
              // Update frontend: decrease available ticket count by 1
              const availableTicketsElem = document.getElementById('ticket-num');
              let availableTickets = parseInt(availableTicketsElem.innerText);
              availableTickets -= 1;
              availableTicketsElem.innerText = availableTickets;
      
              // Make PATCH request to update tickets_sold in the backend
              fetch(`http://localhost:3000/films/${filmId}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tickets_sold: data.tickets_sold + 1 })
              })
              .then(() => {
                // Handle successful ticket purchase
                console.log('Ticket purchased successfully');
              })
              .catch(error => {
                console.error('Error purchasing ticket:', error);
                // Handle error in ticket purchase
              });
            } else {
              // Handle case where tickets are sold out
              console.log('Tickets are sold out');
            }
          })
          .catch(error => {
            console.error('Error fetching film details:', error);
            // Handle error in fetching film details
          });
      });
  
    // Event listener for Delete film button
    document.getElementById('films').addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
          const filmTitle = event.target.innerText;
          
          // Implement film deletion logic here
          // Update frontend (optional)
          
          // Make a DELETE request to delete the film based on the film title or ID
          fetch('http://localhost:3000/delete-film', {
            method: 'DELETE',
            body: JSON.stringify({ title: filmTitle }), // Send the film title or ID for deletion
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            // Handle the response if needed
            console.log('Film deleted successfully');
          })
          .catch(error => {
            console.error('Error deleting film:', error);
          });
        }
      });
    // Initial setup when the page loads
    fetchMovieDetails();
    fetchMovieMenu();
  });
  