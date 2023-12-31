const { invoke } = window.__TAURI__.tauri;

function openNav() {
  document.getElementById("sidebar").style.width = "250px";
}

function closeNav() {
  document.getElementById("sidebar").style.width = "0";
}

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMWE3NGExNy1jNjFmLTQ2NTYtOTA3My0xZDU3ODk3NjNhNGIiLCJpZCI6MTc2NjQ3LCJpYXQiOjE2OTkzNzI3NjJ9.AIUtu9inNbyUpMRFZH5jN9PRWp1N2noqiZ_TrzWD5ro';

// Add event listener for the enter key on the chat input
document.getElementById('chatInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    window.sendMessage();
  }
});


// Define sendMessage globally
window.sendMessage = function() {
  const chatInput = document.getElementById('chatInput');
  const chatMessagesContainer = document.getElementById('chatMessages');
  const userQuery = chatInput.value;
  chatInput.value = '';

  // Display the user's query in the chat interface
  const userMessage = document.createElement('div');
  userMessage.textContent = `You: ${userQuery}`;
  userMessage.classList.add('user-message');
  chatMessagesContainer.appendChild(userMessage);

  // Send the query to the Rust backend
  invoke('process_user_query', { query: userQuery })
    .then(response => {
      // Display the Rust backend's response in the chat interface
      const responseMessage = document.createElement('div');
      responseMessage.textContent = `Rust: ${response}`;
      responseMessage.classList.add('system-message');
      chatMessagesContainer.appendChild(responseMessage);
    })
    .catch(error => {
      console.error("Error processing user query:", error);
      // Optionally, display an error message in the chat interface
      const errorMessage = document.createElement('div');
      errorMessage.textContent = `Error: ${error}`;
      chatMessagesContainer.appendChild(errorMessage);
    });
};

window.clearMessages = function() {
  const chatMessagesContainer = document.getElementById('chatMessages');
  chatMessagesContainer.innerHTML = ''; // This clears all the content inside the chat messages container
};

  // Delay the initialization of the Cesium viewer using setTimeout
  setTimeout(() => {
    var viewer = new Cesium.Viewer('cesiumContainer', { 
      infoBox: false 
      // ... other options
    });
  
    const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
    toggleSidebarBtn.addEventListener('click', function() {
      if (document.getElementById("sidebar").style.width === "0px" || !document.getElementById("sidebar").style.width) {
        openNav();
      } else {
        closeNav();
      }
    });

    const toggleChatBtn = document.getElementById('toggleChatBtn');
    const chatSidebar = document.getElementById('chatSidebar');
    toggleChatBtn.addEventListener('click', function() {
      if (chatSidebar.style.width === '250px') {
        chatSidebar.style.width = '0';
      } else {
        chatSidebar.style.width = '250px';
      }
    });

    document.getElementById('loadDataBtn').addEventListener('click', function() {
      // Fetch data from Rust backend using Tauri's API
      invoke('get_geocoordinates').then(data => {
          console.log("Received data from Rust:", data);
          data.forEach(point => {
              var entity = viewer.entities.add({
                  position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude),
                  point: {
                      pixelSize: 5,
                      color: Cesium.Color.BLUE
                  },
                  description: point.description
              });
          });
      });
  });
  
  document.getElementById('loadFlightDataBtn').addEventListener('click', function() {
    // Fetch flight data from Rust backend using Tauri's API
    invoke('get_flight_coordinates')
    .then(data => {
        console.log("Received flight data from Rust:", data);
        data.forEach(flight => {
            var entity = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(flight.longitude, flight.latitude),
                point: {
                    pixelSize: 7,
                    color: Cesium.Color.BLUE 
                },
                description: flight.description
                
            });
        });
    })
    .catch(error => {
        console.error("Error fetching flight data:", error);
    });
});
  
  document.getElementById('clearDataBtn').addEventListener('click', function() {
      viewer.entities.removeAll();
  });
  
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  var lastHoveredEntity = null;  // Variable to keep track of the last hovered entity
  
  handler.setInputAction(function(movement) {
      var pickedObject = viewer.scene.pick(movement.endPosition);
  
      // If there was a previously hovered entity, hide its label
      if (lastHoveredEntity) {
          lastHoveredEntity.label = undefined;
      }
  
      if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id) && Cesium.defined(pickedObject.id.description)) {
          // Show the label when hovering over the point
          pickedObject.id.label = {
              text: pickedObject.id.description,
              font: '20px sans-serif',
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0, -10)
          };
          lastHoveredEntity = pickedObject.id;  // Update the last hovered entity
      }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    }, 1000);

      // const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
      // const sidebar = document.getElementById('sidebar');
      // let timeoutId = null; // To store the setTimeout ID
  
      // toggleSidebarBtn.addEventListener('click', function() {
      //   if (sidebar.style.display === 'none' || !sidebar.style.display) {
      //       sidebar.style.display = 'block';
      //   } else {
      //       sidebar.style.display = 'none';
      //   }
      //   toggleSidebarBtn.style.display = 'none'; // Hide the button after it's clicked
      // });
  
      // // Show the button when hovering over the top-left portion of the screen
      // document.addEventListener('mousemove', function(event) {
      //   if (event.clientX < 100 && event.clientY < 100 && !timeoutId) { 
      //     timeoutId = setTimeout(() => {
      //       if (event.clientX < 100 && event.clientY < 100) {
      //         toggleSidebarBtn.style.display = 'block';
      //       }
      //       timeoutId = null; // Reset the timeout ID
      //     }, 500); // 500ms delay
      //   } else if (event.clientX >= 100 || event.clientY >= 100) {
      //     clearTimeout(timeoutId); // Clear the timeout if the mouse moves out of the top-left corner
      //     timeoutId = null; // Reset the timeout ID
      //   }
      // });
  
      // Add an event listener to the button to handle data fetching when clicked
  //     document.getElementById('loadDataBtn').addEventListener('click', function() {
  //         // Fetch data from Rust backend using Tauri's API
  //         invoke('get_geocoordinates').then(data => {
  //           console.log("Received data from Rust:", data); // <-- Log the data
  //           data.forEach(point => {
  //               var entity = viewer.entities.add({
  //                   position : Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude),
  //                   point : {
  //                       pixelSize : 5,
  //                       color : Cesium.Color.BLUE
  //                   },
  //                   label : {
  //                       text : point.description,
  //                       verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
  //                       pixelOffset : new Cesium.Cartesian2(0, -10)
  //                   }
  //               });
  //           });
  //         });
  //     });
  
  //     // Add an event listener to the clear data button to remove all entities from the viewer
  //     document.getElementById('clearDataBtn').addEventListener('click', function() {
  //         viewer.entities.removeAll();
  //     });
  
  //     // Handle right-click events on the Cesium viewer
  //     var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  //     handler.setInputAction(function(click) {
  //         // Get the position of the right-click
  //         var cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
  //         if (cartesian) {
  //             var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  //             var longitude = Cesium.Math.toDegrees(cartographic.longitude);
  //             var latitude = Cesium.Math.toDegrees(cartographic.latitude);
  //             console.log(`Right-clicked at position: Longitude: ${longitude}, Latitude: ${latitude}`);
              
  //             // You can add more functionality here, like adding a marker or invoking a Rust function
  //         }
  //     }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  
  // }, 1000);
  