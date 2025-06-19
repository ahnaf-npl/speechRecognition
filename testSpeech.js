var tspSocket = (function () {
  return {
    grantPermission: function (lang) {
      grantPermissionF(lang || "ja-JP"); // Default Jepang
    },
    stopRecording: function () {
      stopRecordingF();
    },
    sendText: function () {
      sendRecording();
    },
  };
})();

var recognizing = false;
var speech;

function getRecognizer() {
  // Cross-browser support
  return window.SpeechRecognition
    ? new SpeechRecognition()
    : window.webkitSpeechRecognition
    ? new webkitSpeechRecognition()
    : null;
}

function reset() {
  recognizing = false;
  speech.start();
}

speech = getRecognizer();
if (!speech) {
  alert("Browser tidak mendukung SpeechRecognition!");
}

// -- konfigurasi dasar --
speech.continuous = false;
speech.interimResults = true;

function grantPermissionF(lang) {
  try {
    speech.lang = lang || "ja-JP";
    speech.start();
  } catch (error) {
    reset();
  }
}

function stopRecordingF() {
  recognizing = false;
  speech.stop();
}

function sendRecording() {
  // Kirim ke API/Backend jika perlu
  to_send_transcript = "";
}

var to_send_transcript = "";
speech.onstart = function () {
  recognizing = true;
};

speech.onresult = function (event) {
  var interim_transcript = "";
  var final_transcript = "";
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final_transcript += event.results[i][0].transcript;
      document.getElementById("interVoiceText").innerText = "";
      to_send_transcript += " " + final_transcript;

      if (document.getElementById("finalVoiceText").innerText.length >= 300) {
        document.getElementById("finalVoiceText").innerText =
          final_transcript + " ";
        sendRecording(final_transcript); // Kirim ke API/Backend jika perlu
      } else {
        document.getElementById("finalVoiceText").innerText +=
          final_transcript + " ";
      }
    } else {
      interim_transcript += event.results[i][0].transcript;
      document.getElementById("interVoiceText").innerText = interim_transcript;
    }
  }
};

speech.onerror = function (event) {
  speech.stop();
};

speech.onend = function () {
  if (recognizing) {
    reset();
  }
};
