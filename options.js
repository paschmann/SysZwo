// Saves options to chrome.storage
function save_options() {
  var cadence = document.getElementById('cadence').value;
  chrome.storage.sync.set({
    preferredCadence: cadence
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    preferredCadence: '90'
  }, function(items) {
    document.getElementById('cadence').value = items.preferredCadence;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);