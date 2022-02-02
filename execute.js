// this code will be executed when the extension's button is clicked
(function () {
  if (document.domain == 'systm.wahoofitness.com') {
    var svg = getDataFromSVG("[data-test='mainContainer-WorkoutProfile']");
    var workouts = parseSVGToArray(svg);
    var doc = createZwoXMLFromArray(workouts);
    writeZwoXMLtoFile(doc);
  } else {
    alert("Not a valid workout URL")
  }

})();

function getDataFromSVG(sSVGElement) {
  try {
    return $(sSVGElement).find("svg")[0].outerHTML
  } catch (err) {
    console.log(err);
    alert("No Power Graph found on page");
  }
}

function parseSVGToArray(sSVG) {
  try {
    var parser = new DOMParser();
    var doc = parser.parseFromString(sSVG, "image/svg+xml");
    return Array.from(doc.querySelectorAll("rect"));
  } catch (err) {
    console.log(err);
    alert("Unable to parse SVG data from power graph");
  }
}

function createZwoXMLFromArray(workouts) {
  try {
    var ftp = $("[data-test='ftp-chip']")[0].innerHTML
    console.log(ftp);

    var workoutname = $("[data-test='bannerWorkoutTitle']")[0].innerHTML.trim();
    console.log(workoutname);

    //var workoutdesc = $("[data-test='description']")[0].innerHTML.trim();

    var workoutduration = $("[data-test='duration']").text().trim();
    console.log(workoutduration);

    var workoutinfo = $("[data-test='bottomMeta']").text().trim();
    console.log(workoutinfo);

    //Create new zwo file:
    var doc = document.implementation.createDocument("", "", null);
    var workout_file = doc.createElement("workout_file");

    var author = doc.createElement("author")
    author.innerHTML = "SysZwo"
    workout_file.appendChild(author);

    var name = doc.createElement("name")
    name.innerHTML = workoutname.trim()
    workout_file.appendChild(name);

    var desc = doc.createElement("description")
    desc.innerHTML = "Duration:" + workoutduration + ", FTP: " + ftp + ", " + workoutinfo
    workout_file.appendChild(desc);

    var sport = doc.createElement("sportType")
    sport.innerHTML = "bike"
    workout_file.appendChild(sport);

    var durationtype = doc.createElement("durationType")
    durationtype.innerHTML = "time"
    workout_file.appendChild(durationtype);

    var tags = doc.createElement("tags")
    workout_file.appendChild(tags);

    var workout = doc.createElement("workout");

    for (var i = 0; i < workouts.length - 2; i++) {
      var interval = workouts[i];
      var steadystate = doc.createElement("SteadyState");
      var powerratio = (parseInt(interval.height.animVal.value) / parseInt(ftp)).toFixed(2);
      steadystate.setAttribute("Duration", interval.width.animVal.value);
      steadystate.setAttribute("Power", powerratio);
      steadystate.setAttribute("Cadence", "0"); //Unknown, would be great have :)
      workout.appendChild(steadystate);
    }

    workout_file.appendChild(workout);
    doc.appendChild(workout_file);
    return doc;
  } catch (err) {
    console.log(err);
    alert("Unable to create ZWO file from data.")
  }

}

function writeZwoXMLtoFile(doc) {
  try {
    var workoutname = $("[data-test='bannerWorkoutTitle']")[0].innerHTML.trim();
    var sContents = new XMLSerializer().serializeToString(doc);
    var filename = workoutname + ".zwo";
    var pom = document.createElement('a');
    var bb = new Blob([sContents], { type: 'text/plain' });

    pom.setAttribute('href', window.URL.createObjectURL(bb));
    pom.setAttribute('download', filename);

    pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
    pom.draggable = true;
    pom.classList.add('dragout');

    pom.click();
  } catch (err) {
    console.log(err);
    alert("Unable to write ZWO to file")
  }
}

