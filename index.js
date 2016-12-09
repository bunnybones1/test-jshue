require('./vendor/jshue');
var hue = jsHue();

hue.discover(
    function(bridges) {
        if(bridges.length === 0) {
            console.log('No bridges found. :(');
        }
        else {
            bridges.forEach(function(b) {
                console.log('Bridge found at IP address %s.', b.internalipaddress);
                connectToBridge(b.internalipaddress);
            });
        }
    },
    function(error) {
        console.error(error.message);
    }
);

var user;
function connectToBridge(ip) {
	var bridge = hue.bridge(ip);

	// create user account (requires link button to be pressed)
	var loopId = setInterval(function() {
		bridge.createUser('foo application', function(data) {
			if(data[0].error) {
			    console.log(data[0].error.description);
				return;
			}
		    // extract bridge-generated username from returned data
		    var username = data[0].success.username;

		    console.log('New username:', username);

		    // instantiate user object with username
		    user = bridge.user(username);

		    startLightLoop();

		    clearInterval(loopId);
		});
	}, 2000);
}

function startLightLoop() {
	window.requestAnimationFrame(rafLoop);
}

var skip = 10;
var counter = 0;
function rafLoop() {
	window.requestAnimationFrame(rafLoop);
	if(counter < skip) {
		counter++;
		return;
	} else {
		counter = 0;
	}
	var ratios = [
		(Date.now() / 1000 / 10) % 1,
		(Date.now() / 1000 / 9) % 1,
		(Date.now() / 1000 / 8) % 1
	];
	for (var i = 3; i >= 0; i--) {
		var hue = ~~(256*256 * ratios[i]);
		user.setLightState(i, {
			"hue": hue,
			"on": true,
			"bri": 254
		}, function(data) { /* ... */ });
	}
	
}
