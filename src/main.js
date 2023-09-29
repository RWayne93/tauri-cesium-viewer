const { invoke } = window.__TAURI__.tauri;

function openNav() {
  document.getElementById("sidebar").style.width = "250px";
}

function closeNav() {
  document.getElementById("sidebar").style.width = "0";
}

// let greetInputEl;
// let greetMsgEl;

// async function greet() {
//   greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
// }

// window.addEventListener("DOMContentLoaded", () => {
//   greetInputEl = document.querySelector("#greet-input");
//   greetMsgEl = document.querySelector("#greet-msg");
  
//   if (greetInputEl && greetMsgEl) {
//     document.querySelector("#greet-form").addEventListener("submit", (e) => {
//       e.preventDefault();
//       greet();
//     });
//   }

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
  
    document.getElementById('loadDataBtn').addEventListener('click', function() {
      // Fetch data from Rust backend using Tauri's API
      invoke('get_geocoordinates').then(data => {
        console.log("Received data from Rust:", data);
        data.forEach(point => {
          var entity = viewer.entities.add({
            position : Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude),
            point : {
              pixelSize : 5,
              color : Cesium.Color.BLUE
            },

            description : point.description
            // label : {
            //   text : point.description,
            //   font : '10px sans-serif',
            //   verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
            //   pixelOffset : new Cesium.Cartesian2(0, -10)
            // }
          });
        });
      });
    });

      document.getElementById('clearDataBtn').addEventListener('click', function() {
          viewer.entities.removeAll();
      });
  
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function(movement) {
      var pickedObject = viewer.scene.pick(movement.endPosition);
      if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
          // Show the label when hovering over the point
          pickedObject.id.label = {
              text : pickedObject.id.description,
              font : '20px sans-serif',
              verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
              pixelOffset : new Cesium.Cartesian2(0, -10)
          };
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
  