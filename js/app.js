/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

var apiKey;
var sessionId;
var token;
var audioInputDevices;
var videoInputDevices;
var session;
var publisher;
var subscriber;
var strmConnection;
var connectionCount = 0;
var eventConnection;
var publisher_screen;
var publisher1;

function handleError(error) {
  if (error) {
    console.error(error);
  }
}

function initializeSession() {
  session = OT.initSession(apiKey, sessionId);
  console.log('session created: ', session)
  // Subscribe to a newly created stream
  session.on('streamCreated', function streamCreated(event) {
    console.log('event --- ', event.stream)
    connectionCount++;
    console.log('connection count - ', connectionCount)
    eventConnection = event.stream.connection;
    console.log('event ---- ', eventConnection)
    var subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      // subscribeToAudio:true, 
      // subscribeToVideo:false
    };
    subscriber = session.subscribe(event.stream, 'subscriber', subscriberOptions, (err) => {
      if (err) {
        console.log('err')
      } else {
        subscriber.isAudioBlocked();
        console.log(subscriber)
        console.log('image data - ', subscriber.getImgData())
      }

    });
    if (subscriber) {
      console.log('image data - ', subscriber.getImgData())
      subscriber.setStyle('backgroundImageURI', 'data:image/png;base64,' + 'images/images.png');

    }


    // if(subscriber) {
    //   subscriber.on('audioLevelUpdated', (event) => {
    //     // if(err){
    //     //   console.log('errr ', err)
    //     // }

    //     console.log('eveeee ', event)

    //   })
    // }
    console.log('subscriber data --- ', subscriber);
    if (subscriber) {
      subscriber.getStats((err, stats) => {
        if (err) {
          console.log('err : ', err)
        } else {
          console.log('subscriber stats are given: ', stats)
        }
      })
    }

    setTimeout(() => {
      if (subscriber) {
        subscriber.getStats((err, stats) => {
          if (err) {
            console.log('err : ', err)
          } else {
            console.log('subscriber stats are given: ', stats)
          }
        })
      }
    }, 5000);

    subscriber.on({
      audioBlocked: function (event) {
        console.log("Subscriber audio is blocked.", event)
      },
      audioUnblocked: function (event) {
        console.log("Subscriber audio is unblocked.", event)
      },

      destoryed: function (event) {
        console.log('event - ', event)
      },

      streamDestroyed: function (event) {
        console.log('event -111 ', event)
      }
    });

  });

  session.on('sessionDisconnected', function sessionDisconnected(event) {
    console.log('You were disconnected from the session.', event.reason);
  });

  session.on('streamDestroyed', (even) => {
    console.log('even ', even)
    alert(even.reason + ' ' + 'with videoType set to ' + even.stream.videoType)
  })

  session.on("connectionCreated", function (event) {
    console.log('event connection created - ', event)
    // connectionCount++;
    // // alert('New connection created count: ', connectionCount)
    // console.log('connection count + ', connectionCount)
    // eventConnection = event.connection;
    // console.log(eventConnection)
    // displayConnectionCount();
  });

  // publisher_screen.on('streamDestroyed', function (event) {
  //   console.log('hadfgddgfh event: ', event)
  //   if (event.reason === 'mediaStopped') {
  //     // User clicked stop sharing
  //     console.log('screen sharing stopped: ', event.reason);
  //   } else if (event.reason === 'forceUnpublished') {
  //     // A moderator forced the user to stop sharing.
  //     console.log('screen sharing stopped: ', event.reason);
  //   }
  // });

  // publisher_screen.on('connectionDestroyed', function (event) {
  //   console.log('hadfgddgfh event: ', event)
  //   if (event.reason === 'mediaStopped') {
  //     // User clicked stop sharing
  //     console.log('screen sharing stopped: ', event.reason);
  //   } else if (event.reason === 'forceUnpublished') {
  //     // A moderator forced the user to stop sharing.
  //     console.log('screen sharing stopped: ', event.reason);
  //   }
  // });

  // initialize the publisher
  // var stream;
  // var isAudioShared = false;
  // try {
  //   stream = await navigator.mediaDevices.getDisplayMedia({video: true, audio: true})
  //   if(stream && stream.getAudioTracks()) {
  //     var audioTracks = stream.getAudioTracks().length;
  //     isAudioShared = audioTracks > 0;
  //   }
  // } catch (error) {
  //   console.log('getDisplayMedia failed');
  // }
  var publisherOptions = {
    name: 'desktop',
    // videoSource: null,
    // audioSource: stream.getAudioTracks()[0],
    // showControls: false,
    width: '100%',
    height: '100%',
    insertMode: 'append'
    // publishAudio: isAudioShared
  };
  publisher = OT.initPublisher('publisher', publisherOptions, handleError);
  if (publisher) {
    publisher.getStats((err, stats) => {
      if (err) {
        console.log('err pub : ', err)
      } else {
        console.log('pub stats 1: ', stats)
      }
    })
  }
  // publisher = OT.initPublisher('publisher-1', publisherOptions, handleError)


  // Connect to the session
  session.connect(token, function callback(error) {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, (err) => {
        if (err) {
          console.log(err.message)
        } else {
          // console.log('stream connection id -', strmConnection.stream.connection.connectionId)
          console.log('successfully published')
          console.log('publisher --- ', publisher.stream.connection.id)
          if (publisher) {
            publisher.getStats((err, stats) => {
              if (err) {
                console.log('err pub : ', err)
              } else {
                console.log('pub stats: ', stats)
              }
            })
          }
        }
      });
    }
  });

}

function disconnectSession() {
  session.disconnect();
  console.log('session disconnected')
}

function startPublishing() {
  var publisherOptions = {
    name: 'desktop',
    insertMode: 'append',
    // videoSource: null,
    // audioSource: stream.getAudioTracks()[0],
    // showControls: false,
    width: '100%',
    height: '100%',
    publishAudio: true,
    publishVideo: true
  };
  publisher = OT.initPublisher('publisher', publisherOptions, handleError);
  // if (publisher1) {
  //   publisher1.getStats((err, stats) => {
  //     if (err) {
  //       console.log('err pub : ', err)
  //     } else {
  //       console.log('pub stats 1: ', stats)
  //     }
  //   })
  // }
  session.publish(publisher, (err) => {
    if (err) {
      console.log('errrrrr')
    }
  })

  // session.connect(token, function callback(error) {
  //   if (error) {
  //     handleError(error);
  //   } else {
  //     // If the connection is successful, publish the publisher to the session
  //     session.publish(publisher1, (err) => {
  //       if (err) {
  //         console.log(err.message)
  //       } else {
  //         // console.log('stream connection id -', strmConnection.stream.connection.connectionId)
  //         console.log('successfully published')
  //         console.log('publisher --- ', publisher.stream.connection.id)
  //         // if (publisher) {
  //         //   publisher.getStats((err, stats) => {
  //         //     if (err) {
  //         //       console.log('err pub : ', err)
  //         //     } else {
  //         //       console.log('pub stats: ', stats)
  //         //     }
  //         //   })
  //         // }
  //       }
  //     });
  //   }
  // });
}

// function getImageSnap() {
//   console.log('publisher --- ', publisher)
//   console.log('subscriber --- ', subscriber);
//   if (subscriber != null) {
//     var imgData1 = subscriber.getImgData();
//     console.log(imgData1)
//     var img1 = document.createElement("img");
//     img1.setAttribute("src", "data:image/png;base64," + imgData1);

//     // Replace with the parent DIV for the img
//     document.getElementById("subscriberView").appendChild(img1);
//   }

//   if (publisher != null) {
//     var imgData = publisher.getImgData();
//     var img = document.createElement("img");
//     img.setAttribute("src", "data:image/png;base64," + imgData);

//     // Replace with the parent DIV for the img
//     document.getElementById("publisherView").appendChild(img);
//   }

// }

function stopPublishing() {
  // session.unsubscribe(subscriber);

  session.unpublish(publisher);
  publisher.destroy();
  // session.disconnect();
  console.log('unpubluished from the session')
}

function startScreenSharing() {

  OT.checkScreenSharingCapability(function (response) {
    console.log('response screen sharing : ', response)
    alert('response - ', response);
    if (!response.supported || response.extensionRegistered === false) {
      // This browser does not support screen sharing.
      alert('screen sharing not supported');
      document.getElementById('screenShareStart').style.visibility = 'hidden';
    } else if (response.extensionInstalled === false) {
      // Prompt to install the extension.
    } else {
      // Screen sharing is available. Publish the screen.
      publisher_screen = OT.initPublisher('screen-preview', {
          videoSource: 'screen'
        },
        function (error) {
          if (error) {
            // Look at error.message to see what went wrong.
          } else {
            session.publish(publisher_screen, function (error) {
              if (error) {
                // Look error.message to see what went wrong.
                console.log(error)
              }
            });
          }
        }
      );
    }
  });

  publisher_screen.on('streamDestroyed', function (event) {
    if (event.reason === 'mediaStopped') {
      // User clicked stop sharing
      console.log('screen sharing stopped: ', event.reason);
      alert('screen sharing stopped');
    } else if (event.reason === 'forceUnpublished') {
      // A moderator forced the user to stop sharing.
      console.log('screen sharing stopped: ', event.reason);
    }
  });
  
}


function stopSharing() {
  console.log('screen share pub : ', publisher_screen)
  console.log('unpublished screen share stream');
  // publisher_screen.on('streamDestroyed', function (event) {
  //   if (event.reason === 'mediaStopped') {
  //     // User clicked stop sharing
  //     console.log('screen sharing stopped: ', event.reason);
  //     alert('screen sharing stopped');
  //   } else if (event.reason === 'forceUnpublished') {
  //     // A moderator forced the user to stop sharing.
  //     console.log('screen sharing stopped: ', event.reason);
  //   }
  // });
}

function getDeviceList() {

  console.log('navigator.mediaDevices.enumerateDevices() : ', navigator.mediaDevices.enumerateDevices())

  OT.getDevices((err, devices) => {
    console.log('------', devices)
    // devices.filter((elem) => {
    //   console.log(elem);
    // })
    devices.forEach((elem) => {
      console.log(elem)
    })
    // audioInputDevices = devices.filter(function(element) {
    //   return element.kind == "audioInput";
    // });
    // videoInputDevices = devices.filter(function(element) {
    //   return element.kind == "videoInput";
    // });
    // for (var i = 0; i < audioInputDevices.length; i++) {
    //   console.log("audio input device: ", audioInputDevices[i].deviceId);
    // }
    // for (i = 0; i < videoInputDevices.length; i++) {
    //   console.log("video input device: ", videoInputDevices[i].deviceId);
    // }

    // console.log(audioInputDevices[0].deviceId, videoInputDevices[i].deviceId)

  })

  OT.getUserMedia().then((stream) => {
    console.log('streams: ', stream.getTracks())
  });
}


function forceDisconnectUsers() {
  console.log('shdgsdhfgsdhfd -', session)
  for (var i = 0; i <= connectionCount.length; i++) {
    console.log('------', connectionCount[i]);
    // session.forceDisconnect(eventConnection)
  }
  console.log(eventConnection)
  session.forceDisconnect(eventConnection)
}

// See the config.js file.
if (API_KEY && TOKEN && SESSION_ID) {
  apiKey = API_KEY;
  sessionId = SESSION_ID;
  token = TOKEN;
  initializeSession();
} else if (SAMPLE_SERVER_BASE_URL) {
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session').then(function fetch(res) {
    return res.json();
  }).then(function fetchJson(json) {
    apiKey = json.apiKey;
    sessionId = json.sessionId;
    token = json.token;

    initializeSession();
  }).catch(function catchErr(error) {
    handleError(error);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}
