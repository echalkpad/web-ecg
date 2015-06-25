$(function() {

		var connection = new WebSocket("ws://"+window.location.hostname+":8081");
		connection.onopen = function () {
			console.log("Connection opened");
			document.getElementById("form").onsubmit = function (event) {
				var msg = document.getElementById("msg");
				if (msg.value)
					connection.send(msg.value);
				msg.value = "";
				event.preventDefault();
			}	
		}
		connection.onclose = function () {
			console.log("Connection closed");
		}
		connection.onerror = function () {
			console.error("Connection error");
		}
		connection.onmessage = function (event) {
      try {
        var msg = event.data;
        msg = msg.replace(/[^\d]+/, '');
        if (msg.match(/^\d+$/)) {
          update(parseInt(msg));
        } else {
          //console.log("invalid message: " + event.data);
        }
      } catch (error) {
        alert("Dado inválido: " + error);
      }
			//var div = document.createElement("div");
			//div.textContent = event.data;
			//document.body.appendChild(div);
		}

		// We use an inline data source in the example, usually data would
		// be fetched from a server

		var data = [];
		var totalPoints = 50;
    var bpm_counter = -1;
    var minimum_bpm = 90;
    var progressBar = 0;
    var d0 = null;
    var d1 = null;
    var sound = document.getElementById("audio");

		while (data.length < totalPoints) {
			y = 0;
			data.push(y);
		}

		function getData(value) {

      if (value > minimum_bpm) {
        if (d0 == null) {
          d0 = (new Date()).getTime();
        } else if (d1 == null) {
          d1 = (new Date()).getTime();
          bpm = (60 / ((d1 - d0) / 1000));
          $("#div-bpm").html(Math.round(bpm) + " bpm");
          // sound.play();
          d0 = null;
          d1 = null;
        }
      }

			data.unshift(value);

      var res = [];
			for (var i = 0; i < data.length; ++i) {
				res.push([i, data[i]])
			}

			return res;
		}

		// Set up the control widget

		var updateInterval = 30;
		$("#updateInterval").val(updateInterval).change(function () {
			var v = $(this).val();
			if (v && !isNaN(+v)) {
				updateInterval = +v;
				if (updateInterval < 1) {
					updateInterval = 1;
				} else if (updateInterval > 2000) {
					updateInterval = 2000;
				}
				$(this).val("" + updateInterval);
			}
		});

		var plot = $.plot("#placeholder", [ getData(0) ], {
			series: {
				shadowSize: 0	// Drawing is faster without shadows
			},
			yaxis: {
				min: 0,
				max: 100
			},
			xaxis: {
				show: false
			}
		});

		function update(value) {

			plot.setData([getData(value)]);

			// Since the axes don't change, we don't need to call plot.setupGrid()

			plot.draw();
			// setTimeout(update, updateInterval);
		}
		//update(100);



});
